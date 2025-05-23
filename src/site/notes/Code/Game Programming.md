---
{"dg-publish":true,"permalink":"/code/game-programming/","tags":["knowledge-base"],"created":"2025-04-04T16:35:15.777+02:00","updated":"2025-05-23T15:07:53.252+02:00"}
---

## Lerp Smoothing
Advantage: Nice smoothing of animations in-place, without having to know/store the start of an animation (like you need for easing functions).

Standard version:
```C
// a - current pos
// b - target pos
// t - factor to move a towards b in each step (0..1)
float lerp(float a,b,t) {
	return (1-t)*a + t*b;
}
void update() {
	a = lerp(a,b,0.01); // move a 1% closer to b each frame
}
```
-> This is framerate dependent and stops working when framerate is not constant.
-> Cannot simply multiply t by dt, since `2*dt` is not the same as calling lerp 2 times (kinda works, but is unstable and can explode if `t*dt > 1`)

Continuous (non recursive) version:
```
// F = fraction to move after one frame
// frame based version (n = frame counter)
f(n) = (a-b)*(1-F)^n+b
// time based version
f(t) = (a-b)*(1-F)^(t/dt)+b
```
-> still framerate dependent

Framerate independent version:
```C
// dt = delta time for last frame in s (Unity: Time.deltaTime)
float lerp_r(float a,b,r,dt) { // r = remainder (in %) after dt
	return b + (a-b)*pow(r,dt);
	// NOTE: pow() is about 8x slower than exp()
}
float lerp_hl(float a,b,hl,dt) { // hl = half life time in s
	return b + (a-b)*exp2(-dt/hl); // exp2(n) = 2^n
}

// Generally use this one (fastest, easy to use):
float lerp_decay(float a,b,l,dt) { // l = decay constant
	return b + (a-b)*exp(-l*dt);
	// useful range for l: 1..25 (slow to fast decay)
}
```
Source: https://www.youtube.com/watch?v=LSNQuFEDOyQ
Better article with detailed explanations (and also springs!): https://theorangeduck.com/page/spring-roll-call
## Engine
https://youtu.be/drCnFueS4og?feature=shared&t=1740
- For strategy/puzzle/simulation-type games (Chess, Sokoban):
	- Rules have to be executed exactly with reproducible results. Players have very precise expectations and the game has to satisfy them and communicate accordingly.
	- Recommended: Isolate code that deals with the rules of the game and keep all of it in one place, so it is clear, condensed, easily understandable and debug-able.
- For action games (Doom, C&C):
	- There is some room of wiggle room, because players do not expect a very precise outcome (much more so in Doom than C&C though)
- Store game state and render state in the same structure for simplicity.
	- Basically follow the [[#Fat/Flat struct (behaviors)]] approach
	- Maintain separate values for actual game state (e.g., health, ammo) and display state (e.g., display health, display ammo).
	- Consider "two-sided death" for entities: logical removal from the game state and gradual removal through animation.
	- DON'T: Have a lot separate classes and interfaces for this stuff. Game state and rendering is strongly linked. One has to be able to quickly add stuff to this, especially in the beginning prototype phase.
	- DON'T: duplicate your data and logic everywhere (e.g. by introducing an event system or animation system to smoothly interpolate display health values). This will increase complexety and introduce bugs in having to sync all these systems.
- Store game state after each frame for easy undo/playback/demo recording.
	- Can always compress it, if needed (e.g. XOR-RLE)
- Keep all entities in a flat array and don't bother removing elements
	- https://youtu.be/drCnFueS4og?t=4079&feature=shared
	- on death, just mark as dead for gameplay, but keep data for display death Animation (see two-sided-death above)
	- no null pointer dereferences, no access violation, no targeting the wrong entity (because the slot got refilled with new data)
	- entity data is usually small (few Megabytes)
	- can be compressed, if needed. E.g. by using ring buffer
	- Alternative methods, like multiple lists, handles or a message system (to broadcast death events) are much more complicated to achieve the same goal
	- This worked great and was very simple to implement in MathTD
- Use stable IDs for entities (e.g., towers) to manage their state and animations effectively.
	- In MathTD we just used the tower array index, which would only increment (never decrement or rollover)
	- A more robust approach would be to generate a random 32 or 64bit id for each new entity and store that in the entity struct. Reference entities by their ID. IDs reach into a hashmap, e.g. by using the bottom 8-12 bits (depending on how many entities can be alive at any point divided by max fill rate -> see [[Code/Data Structures & Algorithms#Hash Tables\|Data Structures & Algorithms#Hash Tables]]) to get an index and then compare the requested ID to the ID of the entity in that slot. -> see https://youtu.be/NW6PhVdq9R8?feature=shared&t=1150 (4mins)
- Separate game rules from display and animation logic for clarity (as represented by the data -> see above)
- Ensure your code is flexible enough to incorporate changes and optimizations based on observed gameplay needs. First explore then decide on the correct structure. Don't add too much abstraction up front, because it might be wrong and will hinder exploration and iteration and is harder to change later.
- Use the prototyping phase not only to refine design and gameplay, but also to identify common operations and performance bottlenecks. 
	- https://youtu.be/drCnFueS4og?feature=shared&t=5000 (10min)
	- Understand that performance requirements might evolve as the game design matures.
	- Start with the simplest implementation. There will be a lot of changes in the beginning, code should be as simple as possible, because it needs to be changed frequently or thrown out. Speed of iteration matters most in the beginning.
	- For example: for a small game (<1000 entities), just loop over the array for collision checking (O(N^2)). Even 1M checks is easily doable for a modern PC. This method always works, is easy to implement and debug. Optimization can happen later, but will make the code more complex. 
	- NOTE: This only works for small games or an explicit prototyping phase. On large projects, once the architecture is in place it will be very hard to change and optimize, so you will need to test beforehand and plan ahead. (->[[Code/Architecture#Premature Optimization\|Architecture#Premature Optimization]])
- For games with complex rules and a lot of dependencies between elements (e.g. Sokoban), a global event queue might be a good approach
	- Don't apply changes (take health, kill entity, change state, etc.) immediately, instead add these requests to a queue
	- Can always inspect the queue during a frame to see what is going on
	- Can re-order or filter the queue based on events that happened later
	- Finally can apply queue to get new state for next frame
	- This pattern also helped during development of the item ELFE (message queues)
- Important for performance: Batching
	- TODO: Find more details
## Entity systems
General approaches to a unit/entity system.
Preferred way for moderately complex games: [[#Preferred Fat/Flat struct (behaviors)]]
For simple games this can also work well (MathTD): [[#Naive fat/flat struct (entity types)]]
### OOP
``` C++
class UnitBase {
	Vec2 pos;
	Vec2 vel;
	int health;
	virtual void simulate(float dt)=0;
}
class UnitGoblin : public UnitBase {
	int damage;
	void calcDmg();
}
```
- Base Class (has general properties like position, velocity, sprite - sometimes implements general behavior, otherwise functions are virtual or abstract) and child classes (which inherit Base Class, add properties and implement/overwrite behavior)
- Store all entities in one array, by storing a pointer to BaseClass* and type casting if specific stuff needs to be accessed
- Disadvantage: Additional layers of indirection through pointers and v-table indirections. Very cache unfriendly. Have to do type checks for each element (or add the same type enum as in the union approach) when processing.
### Discriminated struct/union
``` C
// Approach 1:
enum EntityType {
	etNone=-1,
	etPlayer,
	etGoblin,
	etChest,
};
struct PlayerData {
	int holdingItemId;
	int potionCount;
};
struct GoblinData {
	int damage;
};
struct Entity {
	EntityType type;
	union {
		struct PlayerData;
		struct GoblinData;
	};
};
// Approach 2:
enum DataType {
	dtNone=-1,
	dtPosition,
	dtHealthAndDamage,
};
struct PositionData {
	int x,y;
};
struct HealthAndDamage {
	int hp, dmg;
};
struct Data {
	DataType type;
	union {
		struct PositionData;
		struct HealthAndDamage;
	}
};
struct Entity {
	Data *data; // array
	int size;
};
```
- struct with general data, a "type" flag and a union of structs for storing the data of the different types.
- Advantage: Can be stored in a flat array for quick and cache friendly iterating over all entities
- Disadvantage: a union is basically an if/else branch in the type, so you have to handle that type check everywhere (the correct type is hidden behind one layer of indirection, same as OOP approach). This can become confusing and very complex. Code amount multiplies by number of types, since you have to check each combination (at least to filter the correct ones). Problems arise when type checking is missed and wrong data is accessed/changed.
- Unions are a way to compress data. One has to ask: Is the compression worth it, what do we gain from it? Entity data usually is very small anyway.
### Naive fat/flat struct (entity types)
``` C
struct RenderSprite {
	uint8_t *data;
	int len;
	int w, h;
};
struct ControlledByUser {
	Input in;
};
struct Hostile {
	int damage;
	int aggroRange;
};
struct Player { 
	struct RenderSprite, 
	struct ControlledByUser, 
	struct HasPhysicsShape,
};
struct Tree { 
	struct RenderSprite, 
	struct HasPhysicsShape, 
	struct IsStatic, 
};
struct Jelly { 
	struct RenderSprite, 
	struct ChasePlayer, 
	struct HasPhysicsShape, 
	struct Hostile 
};
```
- Have data bundled by features in structs (without union), switch by type
- Advantage: No indirection for the type check. More transparent, code knows exactly what data it is getting. One array per type is very cache friendly for iterating (not so much when working across types).
- Disadvantage: No union compression. Combinatoric explosion for handler functions, if there are a lot of properties.
- This can still work for simple games with few distinct types (like MathTD)
### Fat/Flat struct (behaviors)
```C
// but instead of Player, Tree, etc.:
enum EntityProperties {
	epRenderSprite = 1<<0,
	epControlledByPlayer = 1<<1,
	epHasPhysicsShape = 1<<2,
	epIsStatic = 1<<3,
	// ...
};
struct Entity {
	uint64_t props; // bitmask for active props
	// Sprite
	struct Texture sprite;
	Vec2 pos;
	// Movement
	Vec2 vel;
	Vec2 acc;
	// Control
	int controllerId;
	int health;
	int damage;
	// etc.
};
// Helper functions for entity "types":
Entity *MakePlayer() {
	Entity *entity = AllocateEntity();
	SetEntProp(entity, epRenderSprite);
	entity->sprite = ...;
	SetEntProp(entity, epControlledByPlayer);
	entity->controllerId = ...;
	//...
	return entity;
}
```
- Have all data for all functionality in one struct and a properties bitmask, which enables/disables part of the behavior.
- Advantage: No need for type checks, code is getting all the data. Switch by feature/property instead of entity type. Compared to the union, code branches become about the behavior (which is more important). No combinatoric explosion, you just handle properties in a flat/linear manner (O(N) mapping to code-paths). 
- Disadvantage: struct can become fairly big (but still small in comparison to other data like textures, so does it even matter?)
- Fully orthogonal structs should be separated and handled differently.
- You may map struct data 1:1 to properties, but sometimes multiple (exclusive) properties can share the same data or properties can use no data at all. This style does not enforce any mapping. Be careful and explicit with sharing data though, else you can run into nasty side-effects.
- Similar to ECS (e.g. in Unity), but ECS has a 1:1 mapping between data and behavior and Unity also splits each into its own file (which you probably don't want, since it spreads behavior out a lot and makes it harder to debug).
- Nice approach for procedural games: You can easily create a 2^N feature space (by looping over the properties) and explore which combinations make sense and which one to disable.
- Alternative to bitmask when more than 64 features are required: [[Code/Langauges/C#Bitmask with more than 64 entries\|C#Bitmask with more than 64 entries]]
- Example: [hatebin - oykukwtnoo](https://web.archive.org/web/20220121023442/https://hatebin.com/oykukwtnoo) with sort-of explanations here [Why don't use discriminated union rather than Sparse System for entity system? | Handmade Network](https://hero.handmade.network/forums/code-discussion/t/7896-why_don%2527t_use_discriminated_union_rather_than_sparse_system_for_entity_system#24630) (read posts by Ryan Fleury). A little bit more background here: [The Yin and Yang of Data Formats](https://web.archive.org/web/20221126193541/https://media.handmade-seattle.com/metadesk/)
- Similar kinds of features can be packed into one struct (similar to a discriminated union):
```C
// Property: epTrigger
enum TriggerKind { ... };
struct Trigger
{
    TriggerKind kind;
    Input input;
    Shape shape;
    EntityHandle source_entity;
    // for type tkChest:
    ItemKind collect_item_kind;
    Item *collect_item;
    // for type tkHazard:
    f32 seconds_to_allow_source_entity;
    AttackFlags attack_flags;
    // can pack the variables associated with
    // types into an union: more compression, but
    // can only access data after type check
};
```
- You can also build a tree of Entities and assign certain behaviors only to parts:
	- e.g. PlayerBody -> Hand -> Weapon and only Weapon has "do damage" property, only PlayerBody has "health" and "damage-able" property
	- or you can have per component health and the hand can be damaged separately from the body (all with the same system)
	- If some data maps to multiple features you can have a combination by having multiple entities (instead of duplicating the data one each entity)
```C
struct Entity
{
  Entity *first_child;
  Entity *last_child;
  Entity *next;
  Entity *prev;
  Entity *parent;
  // other data ...
};
```