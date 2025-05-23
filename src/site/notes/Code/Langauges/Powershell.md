---
{"dg-publish":true,"permalink":"/code/langauges/powershell/","tags":["knowledge-base","german"],"created":"2025-04-26T13:30:21.511+02:00","updated":"2025-05-23T15:04:48.690+02:00"}
---

## Allgemeines
- Hat keinen Drag-and-Drop Handler (anders als Batch oder exe, wo man Dateien direkt auf die Executable ziehen kann)
	- Workaround: https://stackoverflow.com/questions/2819908/drag-and-drop-to-a-powershell-script
- Man kann .NET Funktionen benutzen (sehr mächtig und gute API)
- Ausführung unter Windows 10+11 per default deaktiviert
	- [about_Execution_Policies - PowerShell | Microsoft Learn](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.5)
	- In Admin PowerShell: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
## Cheatsheet
### Argument Parsing
```powershell
param (
    [string]$foo, # -foo file.txt
    [string]$bar = "default",
    [string[]]$array, # -array file.txt, other.foo, bla
    [switch]$flagOn, # -flagOn
    [DateTime]$date, # -date "03.12.2024 13:10:42" -> 12.03.2024 13:10:42
    [int]$num # -num 3.5 -> 4
    [float]$num2 # -num2 -5.42
    # .NET types: System.DayOfWeek, File, custom types, etc.
)
param (
	# Powershell will ask user input if param not defined
	# HelpMessage text is displayed alongside the promt
	[Parameter(Mandatory=$true, HelpMessage="Value for req")]
	[string]$req,
	# "fake" mandatory -> throw if empty
    [ValidateNotNullOrEmpty()] # Alternative to default throw
	[string]$req=$(throw "Error parameter req missing")
	# Eplicitly bind to position, others then must be bound by name
	[Parameter(Position=0)]
	[int]$first
)
# Only bind by name
[CmdletBinding(PositionalBinding=$false)]
param (...)
# Display bound parameters
echo $PSBoundParameters
```
- Parameter werden nach Name ODER Position geparst. Position 0 ist dabei das erste Argument, welches nicht nach Name zugeordnet werden konnte
- Sobald ein Parameter explizit eine Position zugewiesen bekommt, werden die anderen nicht mehr implizit nach Position gebindet
### Dokumentation / Hilfe
```powershell
<#
.SYNOPSIS
Build LUA project for the Playdate
.PARAMETER in
Path to your project folder (main folder or Source directory)
.PARAMETER xyz
Another parameter cool
.DESCRIPTION
Longer description of script
.INPUTS
Details about input via pipes
.OUTPUTS
Details about output you can pipe
.EXAMPLE
PS> .\yourscript.ps1 -example call
.LINK
Online help: https://yourwebsite.biz
#>
param (
    [string]$in,
    [int]$xyz
)
<< your script here >>

# Print info about parameters
Get-Help .\script.ps1
```
### Variablen
```powershell
# Operators
-eq, -ne, -and, -or, -not
```
### Datei oder Ordner
```powershell
# Check if file oder folder (error if not exists)
(Get-Item $path) -is [System.IO.DirectoryInfo]
# Check if file exists
[System.IO.File]::Exists($path)
# Test if path is valid and exists
Test-Path $path
```
### Umbenennen
Alle Dateien in aktuellem Ordner mit fortlaufender Nummer umbenennen
```powershell
ls | %{Rename-Item $_ -NewName ("Bilder_{0}.jpg" -f $nr++)}
```
## Weird shit
### $input
Niemals `$input`als Variablenname oder param nutzen!
https://stackoverflow.com/questions/30546750/function-parameter-always-empty-why
> **`$Input`**
> 
> Contains an enumerator that enumerates all input that is passed to a function. The `$input` variable is available only to functions and script blocks (which are unnamed functions). In the Process block of a function, the `$input` variable enumerates the object that is currently in the pipeline. When the Process block completes, there are no objects left in the pipeline, so the `$input` variable enumerates an empty collection. If the function does not have a Process block, then in the End block, the `$input` variable enumerates the collection of all input to the function.
### HelpMessage
```powershell
param (
	# HelpMessage is displayed in promt for missing mandatory
	# params, but only if user first inputs !? in promt
	[Parameter(Mandatory=$true, HelpMessage="Value for req")]
	[string]$req
)
```
## TODO
for loop over files