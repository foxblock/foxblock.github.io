---
{"dg-publish":true,"permalink":"/code/langauges/batch/","tags":["knowledge-base"],"created":"2025-05-08T19:24:07.675+02:00","updated":"2025-05-23T15:02:55.271+02:00"}
---

## Best practices
- `@echo off` (disable echo by default)
- when setting variables surround whole statement with quotes `set "var=value"` (this handles spaces and other special characters better)
- Better not handle passwords, if you really need to see [[#Handle passwords]]
- surround whole script with `setlocal` and `endlocal` (to not pollute the variable space)
- Use these instead of hard-coded paths: [[#Useful Windows variables]]
- `for %%a in (%*) do (set "%%a=1")` is the simplest parser for flags
- Keep conditions (if/else) to a minimum (many pitfalls: brackets may break comments, variables are expanded only once, code becomes less linear, etc. - goto avoids some of these, but makes the code even less linear)
## Cheatsheet
### echo
```batch
:: turn off echoing all commands executed
@echo off
:: @-symbol: run one command without echo
@set somevar=1
:: echo Text and variable
echo Hello, %username%
:: Blank line
echo.
:: echo message with brackets need escaping when in if/for
if condition (echo text ^(hint^))

rem This is a comment
:: This is also a comment, but causes problems in if/for blocks
:: see: https://www.robvanderwoude.com/comments.php
```
### Variables
#### Set
```batch
:: set without %, use surrounded with %
:: if value contains spaces, surround whole statement with ""
set "var=path\to\exe --whatever"
echo %var%
:: Prints: path\to\exe --whatever
:: if only value is surrounded, "" will become part of value
:: value of %var% will be baked into %var2% at this point
set var2="pre\%var%"
echo %var2%
:: Prints: "pre\path\to\exe --whatever"
:: numeric vars (val == 6)
set /A val=3+3
:: promt user input
set /P "uservar=just a comment, will be overwritten"
:: set multiple vars
:: make sure to use "" else space before & will be included in value
set "foo=bar" & set "poo=bear"
```
#### Compare
```batch
:: Surround var to ensure correct behavior 
:: use "" if value cannot contain " (or it will error)
:: use [] if value cannot contain spaces
:: do not use single quotes ''
%var%==true
[%var%]==[some text]
"%1"=="-h & shift"
"%1" NEQ ""
"%foo%" EQU "%bar%"
:: numeric comparisons
:: LSS, LEQ, GTR, GEQ
if (3 gtr 1) (echo true)
if ("B3" gtr "b2") (echo compares char by char, case-insensitive, b>a)
```
#### Test existance
```batch
:: no % signs!
if defined var (echo yay) else (echo nay)
:: for arguments save to temp var first:
set "var=%~1"
:: Test for existance of foo (not test!)
set test=foo
if not defined %test% (echo foo not defined)
:: alternative (test if empty)
if "%~1"=="" (echo not defined or empty)
```
#### Replace and Substring
```
:: Replace "to" with "from"
set var3=%var:to=from%
:: Substring -> th\to\exe --whatev
set var4=%var:~2,-2%
:: Remove spaces
set var5=%var:=%
:: Remove quotes
set "var6=%var:"=%"
```
https://ss64.com/nt/if.html
### Useful Windows variables
[Recognized environment variables - Windows Deployment | Microsoft Learn](https://learn.microsoft.com/en-us/windows/deployment/usmt/usmt-recognized-environment-variables)
```
%userprofile%        -> C:\Users\schaja
%homepath%           -> \Users\schaja
%username%           -> schaja
%appdata%            -> C:\Users\schaja\AppData\Roaming
%tmp%                -> C:\Users\schaja\AppData\Local\Temp
%systemroot%         -> C:\Windows
%programfiles%       -> C:\Program Files
%programfiles(x86)%  -> C:\Program Files (x86)
```
### Arguments / Command Line Parameters
[Aufruf | Microsoft Learn](https://learn.microsoft.com/de-de/windows-server/administration/windows-commands/call)
```
file.bat "C:\path\to\big file.exe" otherfile.wav -foo
%0    -> file.bat
%1    -> "C:\path\to\big file.exe"
%~1   -> C:\path\to\big file.exe [quotes removed]
%~d1  -> C:
%~n1  -> big file
%~p1  -> \path\to\
%~x1  -> .exe
%~a1  -> --a-------- (file attributes)
%~t1  -> 30.08.2021 13:42 (last change date)
%~z1  -> 1823 (file size in bytes)
%~dp1 -> C:\path\to\ (combination of d and p parameters)
%~f1  -> C:\path\to\big file.exe
%f1   -> f1 [needs tilde]
%2    -> otherfile.wav
%~2   -> otherfile.wav
%~d2  -> [current drive]
%~p2  -> [path to current folder]
%~f2  -> [drive+Path to current folder]\otherfile.wav
%3    -> -foo
%*    -> "path/to/big file.exe" otherfile.wav -foo
```

> [!info] Dropping files
> When dropping a file onto a batch file (in Windows Explorer), the batch is called with the path to the dropped file as first argument `%1` (similar to how exes behave).

> [!info] Spaces
> Paths values with spaces in them need to be quoted, otherwise they will be split into multiple arguments.

> [!warning] Special values and PowerShell
> Values with a `=` in them have to be quoted as well. If the batch script is executed from a PowerShell both single and double quotes are necessary! `'"foo=bar"'`

### for loop
```batch
:: Variable name in loop has to be one letter
:: but must not conflict with path parameters (see above)
:: Loop over integer (start=1, increment=2, end<=100)
for /l %%i in (1, 2, 100) do (echo %%i)

:: Loop over all files (no folders) in current directory and subdirectories
for /r %%a in (*) do (echo %%a)
:: Loop over all folders is current directory
for /D %%a in (*) do (echo %%a)

:: Loop over all arguments
:LoopArgs
if [%1]==[] (goto AfterLoop)
if [%1]==[-h] (goto PrintHelp)
if [%1]==[-i] (set "target=%2" & shift)
shift
goto LoopArgs
:AfterLoop

:: Loop over arguments as flags and set variables
:: .\file.bat compile run -> %compile%=="1", %run%="1"
for %%a in (%*) do (set "%%a=1")

:: Read file line by line
for /f "tokens=*" %%a in (%file%) do (echo %%a)

:: Read file properties (see arguments above)
for %%a in (%file%) do (echo %%~ta)

:: for i in ('where cmake.exe') do (echo i in ('powershell -command "$password = Read-Host -AsSecureString -Prompt 'Enter password'; $plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)); Write-Output $plainPassword"') do (
    set "password=i in (*) do set LIST=%LIST% %%i
:: LIST is just last file found

set _html=Hello^>World
echo %_html%
:: creates a file called World

set /p "var="
:: enter Hello^World!
echo %var%
:: prints HelloWorld!

setlocal EnableDelayedExpansion
set VAR=before
if "%VAR%" == "before" (
    set VAR=after
    if "!VAR!" == "after" @echo If you see this, it worked
)
set LIST=
for %%i in (*) do set LIST=!LIST! %%i
:: LIST contains all files

set _html=Hello^>World
echo !_html!
:: Prints normally

set /p "var="
:: enter Hello^World!
echo %var%
:: prints Hello^World!

endlocal
```
[EnableDelayedExpansion - Windows CMD - SS64.com](https://ss64.com/nt/delayedexpansion.html)
[batch file - How do SETLOCAL and ENABLEDELAYEDEXPANSION work? - Stack Overflow](https://stackoverflow.com/questions/6679907/how-do-setlocal-and-enabledelayedexpansion-work)
### Pitfalls of EnableDelayedExpansion
- ! in strings will need to be escaped
```
echo "Hello World^!"
```
- every line with a ! on it in the batch will lead to any carets on that line being treated as escape chars
```
echo "^^Hello^World!foo^^^bar"
:: Prints "^^Hello^World!foo^^^bar"
setlocal EnableDelayedExpansion
echo "^^Hello^World!foo^^^bar"
:: Prints "^HelloWorldfoo^bar"
endlocal
```
- handling filenames with ! in them in a for loop will fail, because the string will be interpreted as a variable name
- same goes for the usual way of masking passwords using powershell, since a for loop is used a password with ! in them will not be passed properly
## Tidbits
```batch
title My cool window title
pause
```
[Wie Arbeite ich mit Batch UmgebungsVariablen Erstellung Umgang Erweiterungen Veränderungen - Administrator](https://administrator.de/tutorial/wie-arbeite-ich-mit-batch-umgebungsvariablen-erstellung-umgang-erweiterungen-veraenderungen-117069.html#toc13)
## Execution order
[parsing - How does the Windows Command Interpreter (CMD.EXE) parse scripts? - Stack Overflow](https://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/4095133#4095133)
**Phase 0) Read Line:**

**Phase 1) Percent Expansion:**

**Phase 2) Process special characters, tokenize, and build a cached command block:** This is a complex process that is affected by things such as quotes, special characters, token delimiters, and caret escapes.

**Phase 3) Echo the parsed command(s)** Only if the command block did not begin with `@`, and ECHO was ON at the start of the preceding step.

**Phase 4) FOR `%X` variable expansion:** Only if a FOR command is active and the commands after DO are being processed.

**Phase 5) Delayed Expansion:** Only if delayed expansion is enabled

**Phase 5.3) Pipe processing:** Only if commands are on either side of a pipe

**Phase 5.5) Execute Redirection:**

**Phase 6) CALL processing/Caret doubling:** Only if the command token is CALL

**Phase 7) Execute:** The command is executed