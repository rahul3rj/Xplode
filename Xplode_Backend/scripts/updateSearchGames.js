const SearchGame = require("../models/SearchGames");
const axios = require("axios");

const rawList = `

238890	Skyward Collapse
238910	Bionic Dues
238930	7 Grand Steps, Step 1: What Ancients Begat
238960	Path of Exile
239030	Papers, Please
239070	Hammerwatch
239090	Samurai GUNN
239120	Final Fantasy III (3D Remake)
239140	Dying Light
239160	Thief
239200	Amnesia: A Machine for Pigs
239250	Castlevania: Lords of Shadow 2
239350	Spelunky
239430	Q.U.B.E: Director's Cut
239700	Hate Plus
239800	Bleed
239820	Game Dev Tycoon
239840	Dead State
240320	Panzar
240340	Space Ace
240360	Dragon's Lair 2: Time Warp
240440	Quadrilateral Cowboy
240600	MotoGP™13
240620	Wanderlust Adventures
240660	RainBlood Chronicles: Mirage
240720	Getting Over It with Bennett Foddy
240760	Wasteland 2
240970	Half Minute Hero: The Second Coming
241000	Jon Shafer's At the Gates
241240	Contraption Maker
241260	Sherlock Holmes: Crimes and Punishments
241300	Card City Nights 2
241320	Ittle Dew
241410	CastleStorm
241540	State of Decay
241600	Rogue Legacy
241620	Inquisitor
241660	Ohm Studio
241680	Actual Multiple Monitors
241720	Guncraft
241760	Kill to Collect
241790	Z3TA+ 2
241910	Goodbye Deponia
241930	Middle-earth™: Shadow of Mordor™
242050	Assassin's Creed IV Black Flag
242110	Joe Danger 2: The Movie
242130	Vector Thrust
242530	The Chaos Engine
242550	Rayman Legends
242570	Space Hulk
242610	Grappledrome
242640	Styx: Master of Shadows
242680	Nuclear Throne
242700	Injustice: Gods Among Us Ultimate Edition
242720	GunZ 2: The Second Duel
242760	The Forest
242780	Cognition: An Erica Reed Thriller
242820	140
242840	In Verbis Virtus
242860	Verdun
242880	Sir, You Are Being Hunted
242920	Banished
242940	Anachronox
242960	Blood Omen 2: Legacy of Kain
242980	Daikatana
243000	Omikron - The Nomad Soul
243020	Pandemonium
243040	Startopia
243060	Urban Chaos
243160	Mushroom 11
243200	Memoria
243220	FRACT OSC
243280	Poof
243360	TrackMania² Valley
243450	Urban Trial Freestyle
243470	Watch_Dogs
243780	PixelJunk™ Monsters Ultimate
243800	Gas Guzzlers Extreme
243890	Mavis Beacon Teaches Typing Family Edition
243930	Bound By Flame
243950	Divinity: Dragon Commander
243970	Invisible, Inc.
244030	Take On Mars
244050	Rise of Flight United
244070	Sid Meier's Ace Patrol
244090	Sid Meier's Ace Patrol: Pacific Skies
244160	Homeworld Remastered Collection
244210	Assetto Corsa
244410	Supreme Ruler 1936
244430	realMyst: Masterpiece Edition
244450	Men of War: Assault Squad 2
244590	Epigenesis
244690	Face Noir
244710	Shelter 1
244730	Divekick
244750	Aztez
244770	StarMade
244810	Foul Play
244830	Wing IDE 5
244850	Space Engineers
244870	Electronic Super Joy
244890	Velocity®Ultra
244910	Homesick
244950	Where is my Heart?
245010	Deathtrap Dungeon
245050	SpellForce 2 - Demons of the Past
245150	The Novelist
245170	Skullgirls 2nd Encore
245280	ENSLAVED™: Odyssey to the West™ Premium Edition
245300	Disney Epic Mickey 2
245370	Etherium
245390	I Have No Mouth, and I Must Scream
245410	Wizardry 6: Bane of the Cosmic Forge
245430	Wizardry 7: Crusaders of the Dark Savant
245450	Wizardry 8
245470	Democracy 3
245490	Trials Fusion
245620	Tropico 5
245730	Flashback
246070	Hack 'n' Slash
246090	Spacebase DF-9
246110	MASSIVE CHALICE
246300	Paranormal
246360	Perfection.
246420	Kingdom Rush
246580	The Typing of The Dead: Overkill
246620	Plague Inc: Evolved
246680	Secrets of Rætikon
246720	Wayward Manor
246740	Huntsman - The Orphanage Halloween Edition
246760	Legends of Eisenwald
246800	BeatBlasters III
246820	Jeklynn Heights
246840	FATE
246880	Recruits
246900	Viscera Cleanup Detail
246920	Bombernauts
246940	Lords of the Black Sun
246960	Giana Sisters: Twisted Dreams - Rise of the Owlverlord
246980	InFlux
247000	Talisman: Digital Classic Edition
247020	Cook, Serve, Delicious!
247080	Crypt of the NecroDancer
247140	Soundodger+
247240	Volgarr the Viking
247310	Gravi
247350	Artemis Spaceship Bridge Simulator
247370	Mutant Mudds Deluxe
247430	Hitman: Contracts
247660	Deadly Premonition: The Director's Cut
247710	Battledroid
247870	Redshirt
247910	Sniper Elite: Nazi Zombie Army 2
247950	Sacred 3
248170	Clickteam Fusion 2.5
248190	Knytt Underground
248290	Reach for the Sun
248310	Freedom Planet
248330	Dino Run DX
248350	Omegalodon
248370	Bridge It (plus)
248390	Craft The World
248450	Salvation Prophecy
248470	Doorways: Prelude
248490	1953 - KGB Unleashed
248510	Dominions 3
248530	Depth Hunter 2: Deep Dive
248550	Megabyte Punch
248570	Toribash
248610	Door Kickers
248650	Draw a Stickman: EPIC
248710	Iesabel
248730	A Walk in the Dark
248800	Dysfunctional Systems: Learning to Manage Chaos
248820	Risk of Rain (2013)
248860	NEO Scavenger
248970	Vector
249050	Dungeon of the ENDLESS™
249130	LEGO® MARVEL Super Heroes
249190	Ancient Space
249230	Risen 3 - Titan Lords
249330	Unholy Heights
249360	Zafehouse: Diaries
249550	NEStalgia
249570	The Castle Doctrine
249590	Teslagrad
249610	Galactic Arms Race
249630	Delver
249650	Blackguards
249680	Marlow Briggs
249870	Scribblenauts Unmasked
249930	A-Train 8
249950	Forge Quest
249990	FORCED
250030	Lilly Looking Through
250050	Life Goes On
250070	TorqueL
250110	Assault Android Cactus
250180	METAL SLUG 3
250260	Jazzpunk: Director's Cut
250320	The Wolf Among Us
250340	Blockland
250360	MovieWriterPro
250380	Knock-knock
250400	How to Survive
250420	8BitMMO
250460	Bridge Constructor
250500	Super Amazing Wagon Adventure
250520	Underrail
250540	C-Wars
250560	Fight The Dragon
250580	Paranautical Activity: Deluxe Atonement Edition
250600	The Plan
250620	Among the Sleep
250640	[Old Edition] Croixleur Sigma
250660	Bunny Must Die! Chelsea and the 7 Devils
250680	BELOW
250720	Starlight Inception
250760	Shovel Knight: Treasure Trove
250820	SteamVR
250900	The Binding of Isaac: Rebirth
251020	Railroad X
251060	Wargame: Red Dragon
251110	INFRA
251130	Chroma Squad
251150	The Legend of Heroes: Trails in the Sky
251170	Damned
251210	Hive
251230	Livelock
251270	Corpse Party
251290	The Legend of Heroes: Trails in the Sky SC
251310	Eleusis
251370	Escape Goat
251410	Dark Matter
251430	The Inner World
251450	Heroes of Havoc
251470	TowerFall Ascension
251490	Gravity Ghost
251510	Constant C
251530	Anomaly Korea
251570	7 Days to Die
251590	Soul Saga
251630	The Impossible Game
251650	Ray's The Dead
251670	Battle Nations
251690	Speedball 2 HD
251730	Legend of Grimrock 2
251810	Leadwerks Game Engine
251830	Stick It To The Man!
251850	Master Reboot
251870	Go! Go! Nippon! ~My First Trip to Japan~
251910	Solar Flux
251950	WWII Online
251990	Long Live The Queen
252010	Oniken
252030	Valdis Story: Abyssal City
252050	Construction Machines 2014
252070	Gimbal
252090	Lacuna Passage
252110	Lovers in a Dangerous Spacetime
252130	Divide by Sheep
252170	Anomaly Warzone Earth Mobile Campaign
252190	Defender's Quest 2: Mists of Ruin
252230	YAIBA: NINJA GAIDEN Z
252250	Maia
252270	Zombie Tycoon 2: Brainhov's Revenge
252310	Syder Arcade
252330	Slender: The Arrival
252350	Double Dragon Neon
252370	The Shivah
252390	DwarfCorp
252410	SteamWorld Dig
252430	Dusty Revenge
252450	StarDrive 2
252470	Space Pirates and Zombies 2
252490	Rust
252530	OMSI 2
252550	Qbeh-1: The Atlas Cube
252570	Depths of Fear :: Knossos
252610	Death Road to Canada
252630	Eldritch
252670	Nihilumbra
252690	Fantasy Grounds Classic
252710	The Last Express Gold Edition
252730	YOU DON'T KNOW JACK Vol. 1 XL
252750	MouseCraft
252830	Claire
252850	Streamline
252870	PULSAR: Lost Colony
252890	Dracula: Love Kills
252910	Skyscraper Simulator
252950	Rocket League
252970	McDROID
253030	Race The Sun
253110	The Cat Lady
253150	Halfway
253190	Kingdom Wars 2: Battles
253230	A Hat in Time
253250	Stonehearth
253290	FOTONICA
253310	Fester Mudd: Curse of the Gold - Episode 1
253330	Neverending Nightmares
253350	Tiny Barbarian DX
253370	Axis Game Factory's AGFPRO 3.0
253390	Hot Tin Roof: The Cat That Wore A Fedora
253410	Ravensword: Shadowlands
253430	CastleMiner Z
253510	Warmachine Tactics
253570	Gentlemen!
253610	Wrack
253630	Steam Marines
253650	Sparkle 2 Evo
253670	Aartform Curvy 3D 3.0
253690	Tiny Brains
253710	theHunter Classic
253750	Ikaruga
253770	Bus-Simulator 2012
253790	rymdkapsel
253840	Shantae: Half-Genie Hero
253860	Earth 2140 HD
253880	Earth 2150 Trilogy
253900	Knights and Merchants
253920	Gorky 17
253940	Septerra Core
253960	Jack Orlando Director's Cut
253980	Enclave
254060	KnightShift
254080	World War III: Black Gold
254100	World War II: Panzer Claws
254200	FortressCraft Evolved
254300	Dofus
254320	Duskers
254370	Aquanox Deep Descent
254440	Pool Nation
254460	Obscure
254480	Obscure 2
254590	Theme Park Studio
254700	Resident Evil 4 (2005)
254820	Ground Control Anthology
254840	Ground Control II
254860	Lords of the Realm III
254880	MoonBase Commander
254900	Gunlok
254920	Lords of the Realm
254940	Free Running
254960	Silent Storm
254980	Silent Storm Sentinels
255070	Abyss Odyssey
255163	Call of Duty: Ghosts - Digital Hardened Pack
255260	Pro Cycling Manager 2014
255280	1954 Alcatraz
255300	Journey of a Roach
255320	Edna & Harvey: The Breakout
255340	Escape Goat 2
255370	KickBeat Steam Edition
255390	Max: The Curse of Brotherhood
255520	Viscera Cleanup Detail: Shadow Warrior
255710	Cities: Skylines
255870	PixelJunk™ Shooter
255920	The 7th Guest
255940	The 11th Hour
255960	Bad Mojo Redux
256010	Jagged Alliance Flashback
256030	Shadows: Heretic Kingdoms
256070	Truck Racer
256190	Enemy Front
256290	Child of Light
256330	WRC 4 FIA WORLD RALLY CHAMPIONSHIP
256370	MXGP - The Official Motocross Videogame
256390	MotoGP™14
256460	Cosmic Star Heroine
256576	CSX ES44AC Add-on Livery
256611	Train Simulator 2014 - DLC 256611
257030	Project Nimbus: Complete Edition
257050	Darkout
257120	Not The Robots
257170	Rebuild 3: Gangs of Deadsville
257220	Secret Files: Sam Peters
257260	Inherit the Earth: Quest for the Orb
257350	Baldur's Gate II: Enhanced Edition
257400	Fuse
257420	Serious Sam 4
257510	The Talos Principle
257610	LogoMaker 4
257650	Mosaico 
257670	Elder Sign: Omens
257690	J.U.L.I.A.: Among the Stars
257710	Max Gentlemen
257730	Infinity Wars - Animated Trading Card Game
257750	Bloody Trapland
257770	Signal Ops
257790	Riptide GP2
257830	Violett
257850	Hyper Light Drifter
257870	Eschalon: Book 3
257970	Loren The Amazon Princess
257990	Oozi: Earth Adventure
258010	Ring Runner: Flight of the Sages
258050	Survivor Squad
258070	Probability 0
258090	99 Spirits
258180	Deus Ex: The Fall
258200	Talisman: Prologue
258220	Blood Knights
258240	Tank Operations
258520	The Vanishing of Ethan Carter
258643	Train Simulator: NEC: New York-New Haven Route Add-On
258760	Scania Truck Driving Simulator
258880	Professional Farmer 2014
258890	Type:Rider
258950	Montague's Mount
258970	Gauntlet™ 
259000	Dead Pixels II
259060	Dominions 4
259080	Just Cause 2: Multiplayer Mod
259130	Wasteland 1 - The Original Classic
259170	Alone in the Dark (2008)
259190	Alone in the Dark: The New Nightmare
259320	Heli Heroes
259340	Chicken Shoot Gold
259390	Ballpoint Universe: Infinite
259410	Sneaky Sneaky
259430	Zigfrak
259450	Drifter
259470	Particulars
259490	Beast Boxing Turbo
259510	Shufflepuck Cantina Deluxe
259530	Savant - Ascent
259550	Hero of the Kingdom
259600	Finding Teddy
259620	3079 -- Block Action RPG
259640	Guise Of The Wolf
259660	Void Destroyer
259680	Tales of Maj'Eyal
259700	Dead Sky
259720	Fading Hearts
259760	Two Brothers
259780	Nimble Quest
259810	Home Sheep Home: Farmageddon Party Edition
259830	Wooden Sen'SeY
259870	OMG Zombies!
259890	Agricultural Simulator: Historical Farming
259940	YOU DON'T KNOW JACK Vol. 2
259960	YOU DON'T KNOW JACK Vol. 3
259980	YOU DON'T KNOW JACK Vol. 4 The Ride
260000	YOU DON'T KNOW JACK MOVIES
260020	YOU DON'T KNOW JACK SPORTS
260040	YOU DON'T KNOW JACK TELEVISION
260060	YOU DON'T KNOW JACK HEADRUSH
260080	YOU DON'T KNOW JACK Vol. 6 The Lost Gold
260130	Agarest Zero
260160	The Last Tinker: City of Colors
260190	Marc Eckō's Getting Up: Contents Under Pressure
260210	Assassin's Creed Liberation
260230	Valiant Hearts: The Great War™ / Soldats Inconnus : Mémoires de la Grande Guerre™
260250	Blood of the Werewolf
260309	Company of Heroes 2 - The Western Front Armies _MARKETING PAGE
260330	Flockers
260380	Ninja Cats vs Samurai Dogs
260410	Get Off My Lawn!
260430	The Four Kings Casino and Slots
260510	World Basketball Tycoon
260530	So Many Me
260550	Haunted
260570	Gray Matter
260650	Cold War
260690	Dark Fall 1: The Journal
260710	Dark Fall 2: Lights Out
260730	Desperados - Wanted Dead or Alive
260750	Neighbours from Hell
260790	1001 Spikes
260930	Emergency 2014
260990	Odesi Music Composition
261030	The Walking Dead: Season Two
261110	Killer is Dead
261180	Lethal League
261470	Distant Worlds: Universe
261510	Tesla Effect
261530	Lifeless Planet
261550	Mount & Blade II: Bannerlord
261570	Ori and the Blind Forest
261640	Borderlands: The Pre-Sequel
261680	Journal
261700	Eryi's Action
261720	Holy Avatar vs. Maidens of the Dead
261760	Lichdom: Battlemage
261900	The Real Texas
261920	Catzilla
261940	The Mysterious Cities of Gold - Secret Paths
261960	Cube & Star: An Arbitrary Love
262000	Gabriel Knight - Sins of the Fathers
262060	Darkest Dungeon®
262080	Iron Soul
262100	Trench Run
262120	Toy Soldiers: Complete
262150	Vanguard Princess
262190	Zombeer
262210	Last Knight: Rogue Rider Edition
262240	Suguri
262260	Jets'n'Guns Gold
262280	Dungeons 2
262300	Tsukumogami
262370	A.N.N.E
262390	Cloudbuilt
262410	World of Guns: Gun Disassembly
262450	Dead Man's Draw
262470	Rollers of the Realm
262490	Manga maker ComiPo!
262510	Crimson Room: Decade
262550	Gunman Clive
262590	Chuck's Challenge 3D 2020
262610	Liquid Rhythm
262630	Tom vs. The Armies of Hell
262650	RaySupreme 3D
262690	Little Racers STREET
262750	GoD Factory: Wingmen
262770	Freedom Fall
262790	Our Darker Purpose
262810	Super Turbo Demon Busters!
262830	Crimsonland
262850	The Journey Down: Chapter Two
262870	Recovery Search and Rescue Simulation 
262900	Smooth Operators
262920	Super Chain Crusher Horizon
262940	Broken Sword 5 - the Serpent's Curse
262960	Castle In The Darkness
262980	C-RUSH
263020	STARWHAL
263040	Bot Colony
263060	Blockstorm
263100	9.03m
263120	LUDWIG
263140	Postmortem: one must die (Extended Cut)
263180	Squirt's Adventure
263200	Signs of Life
263300	BlazBlue: Calamity Trigger
263320	Saturday Morning RPG
263340	Continue?9876543210
263360	3089 -- Futuristic Action RPG
263380	Driftmoon
263400	War of the Human Tanks
263420	Probably Archery
263460	Girls Like Robots
263480	Final Rush
263520	Enola
263540	Villagers and Heroes
263560	Paper Sorcerer
263620	Mitsurugi Kamui Hikae
263640	CDF Ghostship
263680	Unearthed: Trail of Ibn Battuta - Episode 1 - Gold Edition
263700	Muffin Knight
263720	Brawlout
263740	FootLOL: Epic Soccer League
263760	Turbo Dismount
263800	Spaceforce Constellations
263820	EvilQuest
263860	SPACECOM
263880	Aqua Kitty - Milk Mine Defender
263920	Zombie Grinder
263940	Red Baron Pack
263960	Wyv and Keep: The Temple of the Lost Idol
263980	Out There Somewhere
264000	Son of Nor
264020	Geekbench 3
264060	Full Bore
264080	Vangers
264140	Pixel Piracy
264160	WazHack
264200	One Finger Death Punch
264220	Mr. Bree+
264280	99 Levels To Hell
264300	Guns'N'Zombies
264320	Captain Morgane and the Golden Turtle
264340	Major Mayhem
264380	Narcissu 1st & 2nd
264400	Jacob Jones and the Bigfoot Mystery : Episode 1
264420	Comicado
264440	Children of Liberty
264460	A-men
264520	Moebius: Empire Rising
264540	Platformines
264560	Quest for Infamy
264580	Lost Civilization
264690	Coin Crypt
264710	Subnautica
264730	Deadly 30
265000	FORCED SHOWDOWN
265120	Meridian: New World
265170	Acceleration of Suguri X-Edition
265210	Viscera Cleanup Detail: Santa's Rampage
265240	Crazy Machines: Golden Gears
265300	Lords Of The Fallen
265330	Gomo
265380	Grimind
265470	Even the Ocean
265550	Dead Rising 3
265590	The Red Solstice
265610	Epic Battle Fantasy 4
265630	Fistful of Frags
265690	NaissanceE
265730	Frane: Dragons' Odyssey
265750	Secret Ponchos
265770	Cannons Lasers Rockets
265790	Residue: Final Cut
265810	The Sandbox
265830	Monochroma
265870	Alpha Kimori™ Episode One 
265890	Hexcells
265930	Goat Simulator
265950	Ether One
265970	Worlds of Magic
265990	Rogue's Tale
266010	LYNE
266030	DRAKERZ-Confrontation
266050	Into the Dark
266090	Starlite: Astronaut Rescue
266110	Tower of Guns
266130	Breach & Clear
266150	Lost Saga North America
266170	Windforge
266190	Astral Terra
266210	One Way Heroics
266230	Last Dream
266250	Procyon
266270	Gridiron Solitaire
266290	Helicopter Simulator 2014: Search and Rescue
266310	GameGuru Classic
266330	Ethan: Meteor Hunter
266370	Calibre 10 Racing Series
266390	Farm for your Life
266410	iRacing
266430	Anarchy Arcade
266490	Lili: Child of Geos
266510	Hand of Fate
266840	Age of Mythology: Extended Edition
266980	The Labyrinth of Time
267060	Gravity Badgers
267220	Line Of Defense Tactics - Tactical Advantage
267340	Beware Planet Earth
267360	MURI
267390	Revolution Editions - Shadow & Steel
267490	Batman™: Arkham Origins Blackgate - Deluxe Edition
267530	The LEGO® Movie - Videogame
267600	Airport Simulator 2014
267610	Woodcutter Simulator 2013
267670	Realms of Arkania 1 - Blade of Destiny Classic
267730	Ground Pounders
267900	Guilty Gear Isuka
267920	Gun Metal
267940	Glacier 3: The Meltdown
267960	Hyper Fighters
267980	Hostile Waters: Antaeus Rising
268050	The Evil Within
268130	Heat Signature
268200	Antisquad
268220	Meltdown
268240	Mechanic Escape
268320	Grapple
268340	High Strangeness
268400	Panzer Corps
268500	XCOM 2
268520	Orc Attack: Flatulent Rebellion
268540	The Whispered World Special Edition
268650	From The Depths
268670	The Memory of Eldurim
268750	Magicite
268770	Treasure Adventure World
268850	EVGA Precision X1
268870	Satellite Reign
268890	Masters of the World
268910	Cuphead
268970	You Are Not The Hero
268990	The Dishwasher: Vampire Smile
269010	Science Girls
269030	The Yawhg
269050	Year Walk
269110	Super Motherload
269150	Luxuria Superbia
269170	SportsBar VR 
269190	Edge Of Eternity
269210	Hero Siege
269230	Aces Wild: Manic Brawling Action!
269250	WORLD END ECONOMiCA episode.01
269270	LOVE
269310	Infectonator : Survivors
269330	Chronology
269350	Montas
269370	Reaper - Tale of a Pale Swordsman
269430	Burning Cars
269470	MorphVOX Pro 4 - Voice Changer
269490	Bardbarian
269530	Voice Of Pripyat
269550	Zoom Player Steam Edition
269570	GTGD S1 More Than A Gamer
269590	Claustrophobia: The Downward Struggle
269610	Arcane Worlds
269630	A Mass of Dead
269650	Dex
269670	BADLAND: Game of the Year Edition
269690	RymdResa
269710	Tumblestone
269770	Secrets of Grindea
269790	DreadOut
269850	Get Packed
269890	AR-K
269950	X-Plane 11
269990	Infinite Space III: Sea of Stars
270010	Time Rifters
270050	Quest of Dungeons
270090	N.P.P.D. RUSH - The milk of Ultra violet
270110	Block Story
270130	The Gallery - Episode 1: Call of the Starseed
270150	RUNNING WITH RIFLES
270170	Depression Quest
270190	1Heart
270210	Melody's Escape
270230	Prominence
270270	Frozen State
270310	Dominique Pamplemousse
270330	Ku: Shroud of the Morrigan
270430	Cypress Inheritance: The Beginning
270450	Robot Roller-Derby Disco Dodgeball
270490	The Forest of Doom
270510	EPOCH
270550	Yet Another Zombie Defense
270570	Reversion - The Escape
270590	Long Night
270610	Mage's Initiation: Reign of the Elements
270630	Haunt the House: Terrortown
270750	Realms of Arkania 2 - Star Trail Classic
270760	Realms of Arkania 3 - Shadows over Riva Classic
270770	Etherlords
270790	Etherlords II
270810	Jones On Fire
270830	Global ATC Simulator
270850	Car Mechanic Simulator 2014
270880	American Truck Simulator
270910	Worms World Party Remastered
271240	Offworld Trading Company
271260	Star Control: Origins
271360	Industry Giant 2
271370	Transport Giant
271500	Sniper Art of Victory
271550	Tribloos 2
271570	Space Farmers
271590	Grand Theft Auto V Legacy
271640	Humanity Asset
271670	10 Second Ninja
271760	Dungeon Lords Steam Edition
271820	Card City Nights
271860	Super Killer Hornet: Resurrection
271900	Hexcells Plus
271920	Worlds Adrift Island Creator
271970	Hero and Daughter+
271990	Dreamscape
272010	Aveyond 3-1: Lord of Twilight
272040	KAMI
272060	Serena
272230	Sub Rosa
272270	Torment: Tides of Numenera
272300	CardFile3D
272330	Shadow Blade: Reload
272470	The Incredible Adventures of Van Helsing II
272510	NARUTO SHIPPUDEN: Ultimate Ninja STORM Revolution
272600	Detective Grimoire
272620	Serious Sam's Bogus Detour
272860	Wreckfest Throw-A-Santa + Sneak Peek 2.0
272890	Vertiginous Golf
272920	Rail Adventures
272990	GAUGE
273030	Pro Rugby Manager 2015
273070	The Last Federation
273240	Armored Hunter GUNHOUND EX
273350	Evolve Stage 2
273500	Over 9000 Zombies!
273570	Descent
273580	Descent 2
273590	Descent 3
273600	Descent: Freespace - The Great War
273620	Freespace 2
273730	Driving School Simulator
273740	Extreme Roads USA
273750	Formula Truck 2013
273760	Towtruck Simulator 2015
273770	Game Tycoon 1.5
273790	Agricultural Simulator 2012: Deluxe Edition
273800	Forestry 2017 - The Simulation
273820	Mining & Tunneling Simulator
273830	Aviator - Bush Pilot
273840	Stock Car Extreme
273850	Ski-World Simulator
273860	Snowcat Simulator
273890	Arctic Trucker Simulator
273940	Warehouse and Logistics Simulator
273960	Mechs & Mercs: Black Talons
274010	Ship Simulator: Maritime Search and Rescue
274170	Hotline Miami 2: Wrong Number
274190	Broforce
274230	RONIN
274250	OlliOlli
274270	NOT A HERO
274290	Gods Will Be Watching
274310	Always Sometimes Monsters
274350	Dropsy
274480	Drox Operative
274500	Brigador: Up-Armored Edition
274520	Darkwood
274560	Revolution Ace
274620	Skara - The Blade Remains
274700	868-HACK
274880	Jet Car Stunts
274900	Murder Miners
274940	Depth
274960	Tech Executive Tycoon
274980	Influent
275030	Punch! ViaCAD 2D/3D v9 + 3D Printing PowerPack LT
275060	Alone in the Dark: Illumination
275080	Post Master 
275100	Shelter 2
275180	Costume Quest 2
275200	Westerado: Double Barreled
275270	Patriot: DemocratiZation
275290	Graviteam Tactics: Operation Star
275310	Victorian Admirals Anthology
275330	Anmynor Puzzles
275350	Sentinel 3: Homeworld
275390	Guacamelee! Super Turbo Championship Edition
275470	Chip
275490	Canyon Capers
275510	Z Steel Soldiers
275530	Z
275570	Summoner
275670	Space Run
275810	7 Wonders of the Ancient World
275830	7 Wonders: Magical Mystery Tour
275850	No Man's Sky
276220	My Best Friends - Cats & Dogs
276240	My Vet Practice: In the Country
276300	My Riding Stables
276340	My Riding Stables: Life with Horses
276360	Riding Star
276380	My Pet Hotel
276430	My Pet Hotel 2
276440	Kingdom Tales
276460	Tales From The Dragon Mountain 2: The Lair
276730	Tango Fiesta
276750	Fritz Chess 14
276810	Mordheim: City of the Damned
276870	Dwelvers
276890	FATE: Undiscovered Realms
277110	Return to Mysterious Island
277270	Return to Mysterious Island 2
277390	VIDEOBALL
277430	Halo: Spartan Assault
277450	Imperial Glory
277460	Praetorians
277470	The Book of Legends
277490	Battle Group 2
277500	Farming World
277510	Shiny The Firefly
277520	Albedo: Eyes from Outer Space
277540	Tales From The Dragon Mountain: The Strix
277560	Where Angels Cry
277590	Assassin's Creed Freedom Cry
277630	Panzer Tactics HD
277650	Kult: Heretic Kingdoms
277680	About Love, Hate and the other ones
277700	On Rusty Trails
277751	 The Count of Monster Disco
277850	Sportsfriends
277870	Diehard Dungeon
277890	Shantae: Risky's Revenge - Director's Cut
277910	Mars Colony: Challenger
278080	DYNASTY WARRIORS 8: Xtreme Legends Complete Edition
278100	RIVE
278190	ACID Music Studio 10 - Steam Powered
278360	A Story About My Uncle
278420	Spider: Rite of the Shrouded Moon
278440	0RBITALIS
278460	Skyborn
278490	Aveyond 3-2: Gates of Night
278510	JUDGEMENT SILVERSWORD - Resurrection -
278530	3 Stars of Destiny
278570	Labyrinthine Dreams
278590	Heroes of Legionwood
278620	TinyKeep
278640	Terrian Saga: KR-17
278810	LA Cops
278850	Spaceforce Homeworld
278890	Angvik
278930	Gigantic Army
278970	DiggerOnline
279070	9th Dawn II
279140	Making History: The Great War
279160	Ultionus: A Tale of Petty Revenge
279260	Richard & Alice
279280	Ohmicide
279420	Gardens Inc. – From Rakes to Riches
279440	Joe Dever's Lone Wolf HD Remastered
279460	IHF Handball Challenge 14
279480	Abalone
279500	Nicolas Eymerich The Inquisitor
279520	Rage Runner
279540	Pretentious Game
279560	Dracula 4 and  5 - Special Steam Edition
279580	Devil's Dare
279640	The Troma Project
279720	The I of the Dragon
279740	3D ParticleGen Visual FX
279800	Grim Legends 2: Song of the Dark Swan
279900	Soul Axiom
279920	Infinity Runner
279940	The Book of Unwritten Tales 2
279990	Bridge Constructor Playground
280010	Gunjitsu
280040	A Wizard's Lizard
280140	Millennium - A New Hope
280160	Aragami
280180	Hover
280220	Creeper World 3: Arc Eternal
280320	Adventurer Manager
280360	Interstellaria
280380	Uprising44: The Silent Shadows
280500	KRUNCH
280520	Crea
280540	GhostControl Inc.
280560	Danmaku Unlimited 2
280600	BloodLust Shadowhunter
280640	Dark Shadows - Army of Evil
280680	Krita
280720	Imagine Earth
280790	Creativerse
280830	Foosball - Street Edition
280850	Dollhouse
280890	GhostshipAftermath
280910	T.E.C. 3001
280930	Battlepillars Gold Edition
281060	Reversion - The Meeting
281080	Reversion - The Return
281200	A Boy and His Blob
281220	BloodRayne: Betrayal (Legacy)
281240	Adventure Chronicles: The Search For Lost Treasure
281260	Desert Gunner
281280	Mashed
281350	US and THEM
281370	Real Horror Stories Ultimate Edition
281390	O.R.B: Off-World Resource Base
281410	UberSoldier II
281430	Clans
281450	Disciples Sacred Lands Gold
281520	Ascension to the Throne: Valkyrie
281560	D.W.A.R.F.S.
281580	Wings Over Europe
281610	Homeworld: Deserts of Kharak
281640	The Banner Saga 2
281750	Munin
281820	Explodemon
281840	4PM
281860	RefleX
281920	Splatter - Zombiecalypse Now
281940	Woolfe - The Red Hood Diaries
281990	Stellaris
282010	Carmageddon Max Pack
282030	Carmageddon 2: Carpocalypse Now
282050	MX vs. ATV Supercross Encore
282070	This War of Mine
282100	Fearless Fantasy
282140	SOMA
282210	Sid Meier's Starships
282370	Future Perfect
282400	SuperPower 2 Steam Edition
282440	Quake Live
282530	Castlevania: Lords of Shadow – Mirror of Fate HD
282560	RollerCoaster Tycoon World
282590	Star Ruler 2
282620	The Battle of Sol
282640	LOST ORBIT
282680	Warring States
282760	Circuits
282780	Stick 'Em Up 2
282800	100% Orange Juice
282860	Masterspace
282880	FaeVerse Alchemy
282900	Hyperdimension Neptunia Re;Birth1
282960	The Sands Whisper Your Name
283000	Strategic War in Europe
283020	The Campaign Series: Fall Weiss
283040	Paper Dungeons
283060	Lucent Heart
283080	Super Chibi Knight
283160	House of the Dying Sun
283180	The Samaritan Paradox
283230	Spoiler Alert
283270	Jagged Alliance Gold
283290	Nosferatu: The Wrath of Malachi
283310	Soulbringer
283330	Desert Thunder
283350	Eurofighter Typhoon
283370	Marine Sharpshooter II: Jungle Warfare
283390	Incoming + Incoming Forces
283410	CT Special Forces: Fire for Effect
283430	Litil Divil
283470	The Secret Of Hildegards
283490	Ihf Handball Challenge 12
283560	Munich Bus Simulator
283580	New York Bus Simulator
283600	World of Subways 2 – Berlin Line 7
283640	Salt and Sanctuary
283660	Rabbit Hole 3D: Steam Edition
283680	Astebreed: Definitive Edition
283720	Antinarkomania
283820	KAMUI
283840	ALLTYNEX Second
283880	Heroine's Quest: The Herald of Ragnarok
283920	Putt-Putt Joins the Parade
283940	Freddi Fish and the Case of the Missing Kelp Seeds
283960	Pajama Sam in No Need to Hide When It's Dark Outside
283980	SPY Fox in: Dry Cereal
284000	Putt-Putt and Pep's Balloon-o-Rama
284020	Freddi Fish and Luther's Maze Madness
284050	Sanitarium
284080	Lost Squad
284100	Unclaimed World
284140	Majestic Nights
284160	BeamNG.drive
284180	Magicians & Looters
284200	Robot Rescue Revolution
284220	Diadra Empty
284240	Maize
284260	PANORAMICAL
284390	The Last Door - Collector's Edition
284410	Cornerstone: The Song Of Tyrim
284460	DeadCore
284580	ZAMB! Biomutant Extermination
284710	Abyss: The Wraiths of Eden
284730	Dark Arcana: The Carnival
284750	Enigmatis: The Ghosts of Maple Creek
284770	Enigmatis 2: The Mists of Ravenwood
284830	Clockwork Tales: Of Glass and Ink
284850	Grim Legends: The Forsaken Bride
284870	9 Clues: The Secret of Serpent Creek
284890	Left in the Dark: No One on Board
284910	Purgatory: War of the Damned
284930	Speed Kills
284950	Pixel Puzzles: Japan
284970	Project Root
284990	Solarix
285010	Pixel Puzzles: UndeadZ
285070	Between Me and The Night
285090	Robowars
285110	GearCity
285130	Battleplan: American Civil War
285160	LEGO® The Hobbit™
285190	Warhammer 40,000: Dawn of War III
285310	RollerCoaster Tycoon: Deluxe
285330	RollerCoaster Tycoon 2: Triple Thrill Pack
285350	Kingdom Elemental
285380	On The Road - Truck Simulator
285420	Deadly Sin 2
285440	Crimzon Clover  WORLD IGNITION
285480	The Entente Gold
285500	Hard Truck Apocalypse / Ex Machina
285520	Sledgehammer / Gear Grinder
285580	ACE - Arena: Cyber Evolution
285670	Galactic Command Echo Squad SE
285740	Kitty Powers' Matchmaker
285800	Braveland
285820	Action Henk
285840	Enemy Mind
285900	Gang Beasts
285920	TerraTech
285960	Q*bert: Rebooted
286000	Tooth and Tail
286040	Dead Effect
286100	You Have to Win the Game
286120	QuestRun
286140	Eidolon
286160	Tabletop Simulator
286200	ReignMaker
286220	Pier Solar and the Great Architects
286240	Dog Sled Saga
286260	fault - milestone one
286280	Steel Armor: Blaze of War
286300	Algo Bot
286320	Oknytt
286360	Shadows on the Vatican - Act I: Greed
286380	Strata
286460	Black Mirror II
286480	Black Mirror III
286520	Viking Brothers
286540	Nearwood - Collector's Edition
286660	Avoid Sensory Overload
286690	Metro 2033 Redux
286730	Gunship!
286750	Zoo Empire
286770	Shadow Ops: Red Mercury
286790	Falcon A.T.

`;

// parse into [{ appid: Number, name: String }]
const steamAppids = rawList
  .trim()
  .split(/\r?\n/)
  .map((line) => {
    const m = line.trim().match(/^(\d+)\s+(.+)$/);
    if (!m) return null;
    return { appid: Number(m[1]), name: m[2].trim() };
  })
  .filter(Boolean);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Create axios instance with better defaults
const steamApi = axios.create({
  baseURL: "https://store.steampowered.com/api",
  timeout: 6000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

async function fetchSteamDetails(appid) {
  try {
    const { data } = await steamApi.get(
      `/appdetails?appids=${appid}&cc=IN&l=english`
    );
    return data[String(appid)]?.data || null;
  } catch (err) {
    console.warn(`Steam details fetch failed for ${appid}: ${err.message}`);
    return null;
  }
}

async function getValidCapsuleImage(appid, headerImage) {
  if (!appid) return headerImage || "/default-game-cover.jpg";
  const url = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/capsule_616x353.jpg`;
  try {
    await axios.head(url, { timeout: 5000 });
    return url;
  } catch (err) {
    return headerImage || "/default-game-cover.jpg";
  }
}

// function getPortrait(appid) {
//   if (!appid) return "/default-game-cover.jpg";
//   return `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_600x900.jpg`;
// }

async function fetchPortraitImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/grids/steam/${appid}?types=static`,
      { 
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
        timeout: 5000,
      }
    );
    if (res.data && res.data.success) {
      return res.data.data.map((img) => ({ url: img.url, thumb: img.thumb }));
    }
    return [];
  } catch (err) {
    console.warn(`grid fetch failed for ${appid}: ${err.message}`);
    return [];
  }
}
async function fetchHeroImage(appid) {
  try {
    const res = await axios.get(
      `https://www.steamgriddb.com/api/v2/heroes/steam/${appid}?types=static`,
      {
        headers: { Authorization: `Bearer ${process.env.STEAMGRIDDB_KEY}` },
        timeout: 10000,
      }
    );
    if (res.data && res.data.success) {
      return res.data.data.map((img) => ({ url: img.url, thumb: img.thumb }));
    }
    return [];
  } catch (err) {
    console.warn(`Hero fetch failed for ${appid}: ${err.message}`);
    return [];
  }
}

async function updateSearchGamesInDB() {
  const totalGames = steamAppids.length;
  let processed = 0;
  let failed = 0;
  let skipped = 0;

  for (const game of steamAppids) {
    processed++;
    if (!game?.appid) {
      console.warn(
        `[${processed}/${totalGames}] Skipping entry without appid:`,
        game
      );
      skipped++;
      continue;
    }

    try {
      console.log(
        `[${processed}/${totalGames}] Processing: ${game.name} (${game.appid})`
      );

      let details = await fetchSteamDetails(game.appid);

      // Add delay between requests to avoid rate limiting
      await sleep(2000); // 2 seconds between requests

      if (!details) {
        console.warn(
          `[${processed}/${totalGames}] No details for ${game.appid}, skipping.`
        );
        skipped++;
        continue;
      }

      if (details.type !== "game") {
        console.warn(
          `[${processed}/${totalGames}] Not a game: ${game.appid}, skipping.`
        );
        skipped++;
        continue;
      }

      const heroImage = await fetchHeroImage(game.appid);
      const portraitImage = await fetchPortraitImage(game.appid);

      const capsule_image = await getValidCapsuleImage(
        game.appid,
        details.header_image
      );

      const screenshots = (details.screenshots || []).map((ss) => ({
        id: ss.id,
        url: ss.path_full || ss.path_thumbnail || null,
        path_thumbnail: ss.path_thumbnail || null,
      }));

      const gameDoc = {
        steam_appid: game.appid,
        name: details.name || game.name || "Unknown Title",

        // Basic
        description: details.short_description || "",
        release_date: details.release_date?.date || "",
        price: details.price_overview?.final_formatted || "Free",
        platforms: details.platforms || {},
        genres: details.genres?.map((g) => g.description) || [],

        // Media
        header_image: details.header_image || "/default-game-cover.jpg",
        background: details.background || "/default-game-cover.jpg",
        background_raw: details.background_raw || "/default-game-cover.jpg",
        capsule_image,
        portrait_image: portraitImage,
        hero_image: heroImage,
        screenshots,

        // Texts
        supported_languages: details.supported_languages || "",
        website: details.website || "",
        about_the_game: details.about_the_game || "",
        detailed_description: details.detailed_description || "",

        // Extra fields
        is_free: details.is_free || false,
        required_age: details.required_age || 0,
        controller_support: details.controller_support || "",

        developers: details.developers || [],
        publishers: details.publishers || [],

        price_overview: details.price_overview || {},
        recommendations: details.recommendations || {},
        achievements: details.achievements || {},
        ratings: details.ratings || {},
        support_info: details.support_info || {},
        content_descriptors: details.content_descriptors || {},
        categories: details.categories || [],
        movies: details.movies || [],
        dlc: details.dlc || [],
        packages: details.packages || [],
        package_groups: details.package_groups || [],
        type: details.type || "game",

        // Requirements
        pc_requirements: details.pc_requirements || {},
        mac_requirements: details.mac_requirements || [],
        linux_requirements: details.linux_requirements || [],

        // Misc
        lastUpdated: new Date(),
      };

      const res = await SearchGame.findOneAndUpdate(
        { steam_appid: game.appid },
        { $set: gameDoc },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      console.log(`[${processed}/${totalGames}] ✅ Upserted: ${gameDoc.name}`);
    } catch (err) {
      console.error(
        `[${processed}/${totalGames}] ❌ Error processing appid ${game.appid}: ${err.message}`
      );
      failed++;

      // If it's a rate limit error, wait longer
      if (err.response?.status === 429) {
        console.log("Rate limited, waiting 30 seconds...");
        await sleep(5000);
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total games: ${totalGames}`);
  console.log(`Processed: ${processed}`);
  console.log(`Successful: ${processed - failed - skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Skipped: ${skipped}`);
}

module.exports = {
  updateSearchGamesInDB,
};
