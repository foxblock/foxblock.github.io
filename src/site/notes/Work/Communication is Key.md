---
{"dg-publish":true,"permalink":"/work/communication-is-key/","tags":["opinion"],"created":"2025-04-29T18:53:03.967+02:00","updated":"2025-04-29T20:46:24.033+02:00"}
---

In my experience communication ==can make up== 80% of your job. Any job. Even as a programmer this holds true. What I mean by that is not that you spend up to 80% of your time communicating, but that by not communicating or doing it badly, you give up 80% of your efficiency. 
Let me illustrate with a few examples:
- when you write tickets in Jira, you communicate your intent of a feature to the developers
- when you write code, you implicitly communicate your intent of how to implement a feature to the computer, but also other developers and yourself in the future
- when you document code, you explicitly communicate details about the current state of the code to other developers and yourself in the future 
- when you design an UI, you communicate indirectly to your users about the job to be done
- when you design a physical product, you do the same
- when you write a wiki page, it's a form of communication to a person in the future
This is all on top of sending e-mails, talking in meetings, etc.
## Best practices 
### The right channel
Every medium has its pros and cons. 
- E-mail is good for asynchronous communication and also for leaving a searchable paper trail.
- A message on teams is similar but worse, because the search function is worse than in many e-mail clients.
- A discord message is even worse, since message boards there are a black void out of which no information may be extracted.
- Tickets can be assigned to persons and have a clear state (which communicates intent), but quickly lose value over time and should not store critical information (since they should be discarded after some time)
That means if your message is only valid in the moment (e.g. asking someone for help) Discord or Teams is fine, but if you need to rely on it later on (e.g. asking for a quote), it's probably best to chose a different medium.
OTHER IDEA: consider your message across the following domains: importance over time, recipients (is it important for just one or multiple people), content-length, possible ambiguity/necessary precision,...
Each channel nowadays allows for attaching not only text, but images and video. Images ans video are effective when communicating visual ideas (UI designs, bugs, etc.), but are generally not as searchable as text.

Using too many different channels can also be a challenge. Where did I send this message again, via mail or teams, did I put the data on Sharepoint, a local drive or Confluence, ...? Many of these channels overlap in their functionality. I have been on teams where two local drives, a Sharepoint, a Wiki and multiple Confluence spaces were in use at the same time. Until we get the magical search-everything-fast app, this is a huge pain. 
It's a good idea to have (and to communicate) a clear and unique purpose for each of the tools and get rid of duplicate channels that do not.
### Content-length
As short as possible, as long as necessary.
### Assorted tips
- creating a folder structure for documents a-priori is hard. In my experience it works best to let it form organically and have one designated person clean-up and restore order from time to time. If you have done multiple similar projects, a general pattern may be extracted and used as a starting template. This applies to local/cloud drives as well as Wikis.
- Wiki and Confluence pages are most useful to the person that wrote them. Making them generally accessible and useful is hard and requires effort. If something is useful for multiple people, have them all work on it (not one designated person for documentation). Don't put ephemeral(?) information in there, since keeping it up to date will take a lot of effort. Wikis are good for stuff that is mostly set in stone, a place for permanent documentation.
- Keep communication close to the source of information, close together. Code > Comments > Wiki
## Team size
Though admittedly the smaller the team is, the easier communicating becomes.
TODO




## Heading 2
Test 1234
```C
int main(int argc, char **argv) {
	printf("Hello World!\n");
	return 0;
}
```
#tagtest #another
### Heading 3
> [!WARNING] Title
> foobar

Link: [[Website/Projects Home\|Projects Home]]

Broken Link: [[Work/Management and Vision\|Management and Vision]]

## Another Heading
Test foobar2
![g-schluessel.jpg](/img/user/attachments/g-schluessel.jpg)
