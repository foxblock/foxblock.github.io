---
{"dg-publish":true,"permalink":"/code/programmiersprachen/go/","tags":["knowledge-base"],"created":"2024-12-20T19:13:29.618+01:00","updated":"2025-05-23T14:05:03.439+02:00"}
---

## Cheatsheet
### Types and Zero-Values
```Go
bool - false
string - ""
int (int8..int64), uint (uint8..uint64) - 0
float32, float64 - 0
complex64, complex128 - 0
uintptr, byte (uint8), rune (int32) - 0
interface{} (any) - nil
[slice, map, pointer] - nil
[struct] - all members = their zero-value
```
### var, const
```Go
var name string = "val" // = val optional
name := "val" // implicit typing (name is string)
intVal := int(true) // type conversion
const Pi = 3.14 // no :=
X, Y := 1, 2 // X=1, Y=2
ptr := &name // type is *string
var any interface{}
any = Pi
any = "hello"
name,ok := any.(string) // type assertion
```
### struct
```Go
type Vertex struct {
	X, y float64 // X is public, y is private
}
p := Vertex{1, 3}
p == Vertex{1, 3} // true (only shallow check!)
var p2 = Vertex{X:3.14} // Y:0 is implicit
pp := &Vertex{} // type *Vertex, X,Y=0
val := pp.X // access via dot (unlike C)
```
### Array, slice
```Go
var array [10]float32 // initialized, size is fixed
array2 := [4]int{1,2,3,4}
var slice []int = array2[0:2] // [start,end) -> 1,2
len, cap := len(slice), cap(slice) // 2, 4
newSlice := make([]float32, 2, 3) // dynamic, len=2, cap=3 
newSlice = append(newSlice, Pi, 42.13) // always re-assign!
newSlice = append([]float32{1.0}, newSlice...) // prepend
copy(destSlice, sourceSlice)
var nilSlice []int = nil
nilSlice = append(nilSlice, 10) // works
```
### Map operations
```Go
var m map[string]float32 // not initialized!
m = make(map[string]float32)
m2 := map[string]Vertex {
	"foo": {1,2},
}
delete(m2, "foo")
v, ok := m2["foo"] // v={0,0} (zero value), ok=false
clear(m2) // Go 1.21, also works on slices
```
### Loops, switch
```Go
for i := 0; i < len(str); i++ // all optional, for -> while
for i, value := range array // _,value or just i pssible
for i := range 10 // 0..9
switch os := runtime.GOOS; os { // condition optional
	case "linux":
		fallthrough // implicit break, explicit fallthrough
	case getWorstOs(): // not just static values
	default:
	case val == test(): // alt. if no condition
}
switch v := i.(type) { // type switch
	case int: // v will int value
}
```
### Return values, error handling
```Go
// ignore return values, if with statement, error handling
if _, err := funcWithErr(); err != nil {
	println(err) // print to stderr
} else {
	// do else, err still valid here
}
// err no longer valid here
```
### Functions
```Go
func add(x, y int) (int, error) { } // return val
func sub(x, y int) (result int) { } // naked return
func compute(worker func(int, int) int) int { }
fn := func(x int) bool { }
func varArgs(vals ...int) // for i,v := range vals
type act func(index int) (res int)
go anyFunction(1,2,"foo") // leightweight thread
// same address space, needs synchronization
```
### Methods
```Go
func (v Vertex) DotProduct(other Vertex) int {
	return v.X * other.X + v.Y * other.Y
}
func (v *Vertex) Scale(f int) { 
	v.X *= f
	v.Y *= f
} // = func Scale(v *Vertex,f int), Scale(&p,4)
angle := p.DotProduct(Vertex{3,4})
p.Scale(4) // same operator for pointer and value
```
### Interfaces
```Go
type Abser interface { // define
	Abs() float64
}
func (v *Vertex) Abs() float64 { // implement implicitly
	if (v == nil) { return 0 } // need only for pointers
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}
var a Abser
val := a.Abs() // panic, since a does not hold a value
v := Vertex{3,4}
a = &v // Vertex* implements Abser, so we can assign
fmt.Printf("%v %v %T\n",a.Abs(),a,a) //5 &{3 4} *main.Vertex
var v2 *Vertex
a = v2 // v2 is nil, can still call methods of it:
fmt.Printf("%v %v %T\n",a.Abs(),a,a) //0 <nil> *main.Vertex
```
### Channels
```Go
c := make(chan int)
c <- 42 // send value to channel c (blocking)
x := <-c // receive value from channel c (blocking)
fmt.Printf("%v %v\n", <-c, <-c)
// buffered channel (blocks: send on full, receive on empty)
cb := make(chan int, 100) // capacity of 100 values
close(c) // close channel (only sender!, optional)
v, ok := <-c // ok is false if channel is empty and closed
for i := range c // loop until channel is empty and closed
select { // blocks until one case can be run (random if 2+)
	case c <- x: // same syntax as switch, no break needed
	case <-quit:
	default: // run if nothing is ready
}
```
## Public / Private

> [!important] Capitalization is access/scope management
> ```Go
> type Example struct {
>     PublicField  string
>     privateField int // unexported field
> }
> func Add(val int) int { ... } // exported
> func subt(val int) int { ... } // not exported
> ```

struct members and functions starting with a Capital letters are public/exported, those with lowercase letter are private/unexported (i.e. can only be accessed from the same module)
## Organizing Modules
[Organizing a Go module - The Go Programming Language](https://go.dev/doc/modules/layout)
Unofficial (for big projects): [GitHub - golang-standards/project-layout: Standard Go Project Layout](https://github.com/golang-standards/project-layout)

```
go mod init <modulename>
go get <modulename>
```
### Program with main
-> standalone, will usually not be imported into other projects
``` Go
//// go.mod file
// module name needs to be unique in workspace
// name can be anything, but url is preferred if public repo,
// because this enables installation by:
// go install github.com/someuser/modname@latest
module github.com/someuser/modname

go 1.22.1

require (
	// external packages (get added by go get)
)
```

```Go
//// main.go file
// filename can be anything
// package should be main
package main

func main() {
	// ...
}
```
### Packages / Libraries
-> might be imported into other projects
``` Go
//// go.mod file
// path to code repository, so it can be easily imported by
// import "github.com/someuser/modname"
module github.com/someuser/modname

go 1.22.1

require (
	// external packages (get added by go get)
)
```

> [!INFO] Exported Symbols 
> Symbols (e.g. types and functions) of a module that you want to export, need a name starting with an uppercase letter.

```Go
//// modname.go file
// package name = folder name of project (last component of module name)
package modname

func main() { // not exported
	// ...
}

func Exported() {
    // ...
}
```
### Multiple files / folders
- Main program or library code should be in root directory (next to go.mod)
- All go files in the same directory declare the same package name
- Sub-packages should reside in their own directories. Their package name again should be the name of the directory (e.g. `hash/hash.go` -> `package hash`)
	-  `import "github.com/someuser/modname/hash"` (assuming module name from example above)
	- No separate go.mod file required
- Go will not import packages placed in an `internal`folder from outside of the project (e.g. `internal/trace/trace.go` will only be available to its module)
- Mixing of program and libraries in same module/folder is possible
```
project-root-directory/
  go.mod
  modname.go          -> main module
  modname_test.go     -> test code
  auth/
    auth.go           -> public package auth
    auth_test.go
    token/
      token.go        -> public package auth/token
      token_test.go
  hash/
    hash.go           -> public package hash
  internal/
    trace/
      trace.go        -> private package trace
  cmd/
    prog1/
      main.go         -> test or helper program
    prog2/
      main.go         -> another bundled command
```
### Local overrides
In `go.mod`:
```
replace domain.ext/path/lib => ../local/path
```
Will load library from local files, instead of external repo/cache. Good for testing changes in library modules.
## Update modules
```
go get -u
go mod tidy
```
## Testing
- [Add a test - The Go Programming Language](https://go.dev/doc/tutorial/add-a-test)
- Package: `auth.go` -> Test Code: `auth_test.go`
- same package name
- `import "testing"`
- `func TestSomething(t *testing.T) { }`
- `t.Fatalf("Some error occurred!")`
- `go test -v` to execute tests
```Go
package greetings

import (
    "testing"
    "regexp"
)

// Hello() is external function under test
func TestHelloName(t *testing.T) {
    name := "Gladys"
    want := regexp.MustCompile(`\b`+name+`\b`)
    msg, err := Hello("Gladys")
    if !want.MatchString(msg) || err != nil {
        t.Fatalf(`Hello("Gladys") = %q, %v, want match for %#q, nil`, msg, err, want)
    }
}

func TestHelloEmpty(t *testing.T) {
    msg, err := Hello("")
    if msg != "" || err == nil {
        t.Fatalf(`Hello("") = %q, %v, want "", error`, msg, err)
    }
}
```
## useful modules
```
fmt
strings
strconv
ioutil
os
flag
json
```
## enum / iota
```go
const (
	c0 = iota  // c0 == 0
	c1 = iota  // c1 == 1
	c2 = iota  // c2 == 2
)

const (
	a = 1 << iota  // a == 1 (iota has been reset)
	b = 1 << iota  // b == 2
	c = 1 << iota  // c == 4
)

const (
	u         = iota * 42  // u == 0     (untyped integer constant)
	v float64 = iota * 42  // v == 42.0  (float64 constant)
	w         = iota * 42  // w == 84    (untyped integer constant)
)

const x = iota  // x == 0 (iota has been reset)
const y = iota  // y == 0 (iota has been reset)

const (
	bit0, mask0 = iota, 1<<iota - 1  // bit0 == 0, mask0 == 0
	bit1, mask1                      // bit1 == 1, mask1 == 1
	_, _                             // skips iota == 2
	bit3, mask3                      // bit3 == 3, mask3 == 7
)

const (
	c0 = -1
	c1         // c1 == -1
	c2 = iota  // c2 == 2
)
```
## Exported names
Namen mit Großbuchstaben am Anfang sind "exported". Dies betrifft Variablen in Paketen (für import) und bspw. JSON Encoding/Decoding.
```Go
type Payload struct {
	Index int
	DeviceId string
	test float32
}
var pl Payload
bytes, err := json.Marshal(pl) 
// result: {"Index":0,"DeviceId":""}
```
## JSON
Use ``` `json:"..."` ```  strings to add compile time encoding information. First argument is the exported name of the member. `omitempty` can be used to remove null values from the export. 

> [!IMPORTANT]
> You need to rename fields, if you want to have lowercase starting letters for fields, since only exported fields are included in the marshalling process and exported fields need to start with a capital letter.

> [!WARNING] nil slices ≠ empty slices in JSON
> Nil slices (unitialized slices) are exported as "null", while empty slices (len=0, cap=0) are exported as empty array \[\]. Other than that they behave mostly the same in Go. See [null - nil slices vs non-nil slices vs empty slices in Go language - Stack Overflow](https://stackoverflow.com/questions/44305170/nil-slices-vs-non-nil-slices-vs-empty-slices-in-go-language)

```Go
type Payload struct {
	Array []int `json:"arr"`
	Array2 []int `json:"other"`
	Array3 []int `json:"three,omitempty`
	foo int // not exported, not considered in json marshal/unmarshal
}
var s1 []int         // nil slice
s2 := []int{}        // non-nil, empty slice
s3 := make([]int, 0) // internally same as s2
pl := Payload{s1,s2,s3}
bytes, err := json.Marshal(pl) 
// result: {"arr":null,"other":[]}
```
### Marshal/Unmarshal
Marshal = Encoding (`json.Marshal(var)` gibt json string als `[]byte` zurück)
Unmarshal = Decoding (`json.Unmarshal(byteArray, outVar)` dekodiert das json byte array in outVar)
## Embedded struct
```Go
type Point struct {
	X, Y float64
}
type Rect struct {
	Point
	W, H float64
}
// on init, have to go through embedded type explicitly
r := Rect{Point: Point{0,2}, W:0, H:4}
// on access we can use the sub-member names directly
r.X = 1
r.W = 3
fmt.Println(r) // {{1 2} 3 4}
```
## Closures
```Go
func adder() func(int) int {
	sum := 0
	// return func has access to sum, which is bound to return func
	return func(x int) int {
		sum += x
		return sum
	}
}

func main() {
	// each adder has own context and sum value
	pos, neg := adder(), adder()
	for i := 1; i < 4; i++ {
		fmt.Println(
			pos(i),
			neg(-2*i),
		)
	}
}
// 1 -2
// 3 -6
// 6 -12
```
## Defer
```Go
package main
import "fmt"
func main() {
	fmt.Print("say: ")
	defer fmt.Println("!")
	defer fmt.Print(" world")
	fmt.Print("hello")
}
// say: hello world!
// useful for closing files, channels, etc.
```
## Mutex
```Go
import "sync"
var mu sync.Mutex
mu.Lock()
mu.Unlock()
defer mu.Unlock() // useful to make sure mutex is unlocked
```
## Nil Interfaces (expanded)
```Go
type I interface {
	M()
}
type T struct {
	S string
}
func (t *T) M() {
	if t == nil {
		fmt.Println("<nil>")
		return
	}
	fmt.Println(t.S)
}
func main() {
	var i I
	var t *T // t is nil
	i = t // i is nil
	// calling interface methods of nil values is possible
	i.M() // prints <nil>
	
	var i2 I // nil interface holds no value or type
	i2.M() // runtime exception (panic) - Go does not know which method to call
}
```

## Channels (expanded)
[Channel Axioms | Dave Cheney](https://dave.cheney.net/2014/03/19/channel-axioms)
- nil channels (default value) = BAD
	- send + receive on nil channels block forever
- Caution with closed channels
	- send on a closed channel panics
	- receive on a closed channel (with empty buffer) immediately returns with the zero value

## Common interfaces
```Go
// Stringer (e.g. for fmt.Println())
import "fmt"
type Person struct {
	Name string
	Age  int
}
func (p Person) String() string {
	return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
}
// Error (e.g. for returning error from func)
type MyError struct {
	When time.Time
	What string
}
func (e *MyError) Error() string {
	return fmt.Sprintf("at %v, %s",
		e.When, e.What)
}
// Reader (implemented by files, network, compressors, etc.)
import "io"
// interface: func (T) Read(b []byte) (n int, err error)
r := strings.NewReader("Hello, Reader!")
b := make([]byte, 8)
for {
	n, err := r.Read(b)
	fmt.Printf("n = %v err = %v b = %v\n", n, err, b)
	fmt.Printf("b[:n] = %q\n", b[:n])
	if err == io.EOF {
		break
	}
}
// n = 8 err = <nil> b = [72 101 108 108 111 44 32 82]
// b[:n] = "Hello, R"
// n = 6 err = <nil> b = [101 97 100 101 114 33 32 82]
// b[:n] = "eader!"
// n = 0 err = EOF b = [101 97 100 101 114 33 32 82]
// b[:n] = ""
```
## Generics
```Go
// Index returns the index of x in s, or -1 if not found.
// comparable is a special builtin interface for Generics
func Index[T comparable](s []T, x T) int {
	for i, v := range s {
		// v and x are type T, which has the comparable
		// constraint, so we can use == here.
		if v == x {
			return i
		}
	}
	return -1
}
// Defining your own Generics interface
type Number interface {
	int | int32 | int64 | float32 | float64
}
func sum[T Number](nums []T) T {
	var result T
	for i := range nums {
		result += numbers[i]
	}
	return result
}
// List represents a singly-linked list that holds values of any type.
type List[T any] struct {
	next *List[T]
	val T
}
```
## Break Labels
```go
    done := time.After(1 * time.Millisecond)
    numbers := make(chan int)
outer:
    for {
        select {
        case <-done:
            break outer
        case num := <-numbers:
            fmt.Println(num)
        }
    }
```
## Format time string
```go
fmt.Println(time.Now().Format("20060102150405"))

const (
    stdLongMonth      = "January"
    stdMonth          = "Jan"
    stdNumMonth       = "1"
    stdZeroMonth      = "01"
    stdLongWeekDay    = "Monday"
    stdWeekDay        = "Mon"
    stdDay            = "2"
    stdUnderDay       = "_2"
    stdZeroDay        = "02"
    stdHour           = "15"
    stdHour12         = "3"
    stdZeroHour12     = "03"
    stdMinute         = "4"
    stdZeroMinute     = "04"
    stdSecond         = "5"
    stdZeroSecond     = "05"
    stdLongYear       = "2006"
    stdYear           = "06"
    stdPM             = "PM"
    stdpm             = "pm"
    stdTZ             = "MST"
    stdISO8601TZ      = "Z0700"  // prints Z for UTC
    stdISO8601ColonTZ = "Z07:00" // prints Z for UTC
    stdNumTZ          = "-0700"  // always numeric
    stdNumShortTZ     = "-07"    // always numeric
    stdNumColonTZ     = "-07:00" // always numeric
    stdFracSecond0    = ".0", ".00" // trailing zeros included
    stdFracSecond9    = ".9", ".99" // trailing zeros omitted
)
```
## Reading a file
```Go
// full file into memory
wholeFile, err := ioutil.ReadFile("file.txt")

// line-by-line
file, err := os.Open("file.txt")
if err != nil { log.Fatal(err) }
defer file.Close()
scanner := bufio.NewScanner(file)
for scanner.Scan() {
	fmt.Println(scanner.Text())
}
if err := scanner.Err(); err != nil { log.Fatal(err) }
// by words
scanner := bufio.NewScanner(file)
scanner.Split(bufio.ScanWords)
for Scanner.Scan() {
	fmt.Println(scanner.Text())
}

// in chunks
file, err := os.Open("file.txt")
if err != nil { log.Fatal(err) }
defer file.Close()
const chunkSize = 256
buffer := make([]byte, chunkSize)
for {
	n, err := file.Read(buffer)
	if err != nil && err != io.EOF { log.Fatal(err) }
	if err == io.EOF { break }
	fmt.Println(string(buffer[:n]))
	// print the data like in a hex editor
	fmt.Printf("%s", hex.Dump(buffer))
}
file.Seek(0,0) // return to beginning
file.Seek(6,0) // to byte 6 in file
file.Seek(6,1) // to byte 6 from location (=12)
offset, err := file.Seek(6,2) // to offset=length-6

// File stats
fileinfo, err := file.Stat()
type FileInfo interface {
	Name() string       // base name of the file
	Size() int64        // length in bytes for regular files; system-dependent for others
	Mode() FileMode     // file mode bits
	ModTime() time.Time // modification time
	IsDir() bool        // abbreviation for Mode().IsDir()
	Sys() any           // underlying data source (can return nil)
}
```
## Command Line Arguments
```go
import ("flag")

// Return values are pointers (never nil!)
brokerAddr := flag.String("broker", "ssl://broker.hivemq.com:8883", "Broker address including connection type and port")
username := flag.String("user", "", "Username for the MQTT connection (optional)")
intervalMs := flag.Int("interval", 1000, "Send interval per instance in ms")
// Use existing variables
var decryptFlag bool
flag.BoolVar(&decryptFlag, "d", false, "decrypt the input") // shorthand
flag.BoolVar(&decryptFlag, "decrypt", false, "decrypt the input")

flag.Usage = func() {
	w := flag.CommandLine.Output()

	fmt.Fprintf(w, "Usage of %s:\n", os.Args[0])
	fmt.Fprintln(w)
	const usageStr = `Spawns a set number of clients, 
which send messages with random values to a MQTT broker.`
	fmt.Fprintln(w, usageStr)
	fmt.Fprintln(w)

	// Prints all flags and description text (last argument + default value)
	flag.PrintDefaults()
}

// fills up the variables with data from args
// variables will get their default values (second to last argument) when ommitted
flag.Parse()

// After parsing, any unparsed flags/positional arguments can be handled
cnt := flag.NArg()
arg := flag.Arg(i)
for i,v := range flag.Args() {}
```
Usage
- `-flag, -flag=x, --flag, --flag=x`
- `-flag x, --flag x` (non-boolean flags only)

Positional arguments are not handled as expected! Flag stops parsing on the first positional argument / unhandled flag, so named flags have to come first (while order usually does not matter).
Workaround: https://stackoverflow.com/a/74146375

Shorthand: [Short and Long Options with Go flag standard package (antoniojgutierrez.com)](https://www.antoniojgutierrez.com/posts/2021-05-14-short-and-long-options-in-go-flags-pkg/)
## Printing Errors
``` Go
log.Fatalf("ERROR: %q\n", err)
// Prints: 2024/10/31 15:08:52 ERROR: "error message"
fmt.Printf("ERROR: %q\n", err)
os.Exit(1)
// Prints: ERROR: "error message"
panic(err)
// Prints: panic: error message\n\n<stacktrace>
// exit code 2
```