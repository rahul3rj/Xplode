const SearchGame = require("../models/SearchGames");
const axios = require("axios");

const rawList = `
730	Counter-Strike 2
578080	PUBG: BATTLEGROUNDS
2767030	Marvel Rivals
570	Dota 2
1172470	Apex Legends™
1551360	Forza Horizon 5
3224770	Umamusume: Pretty Derby
2807960	Battlefield™ 6
899770	Last Epoch
1517290	Battlefield™ 2042
3527290	PEAK
3240220	Grand Theft Auto V Enhanced
1285190	Borderlands 4
381210	Dead by Daylight
2552430	KINGDOM HEARTS -HD 1.5+2.5 ReMIX-
916440	Anno 1800
2417610	METAL GEAR SOLID Δ: SNAKE EATER
252490	Rust
3405690	EA SPORTS FC™ 26
230410	Warframe
1384160	GUILTY GEAR -STRIVE-
553850	HELLDIVERS™ 2
582160	Assassin's Creed® Origins
2274620	Discounty
3556750	Warhammer 40,000: Dawn of War - Definitive Edition
2507950	Delta Force
2074920	The First Descendant
306130	The Elder Scrolls® Online
1364780	Street Fighter™ 6
1151340	Fallout 76
438100	VRChat
2694490	Path of Exile 2
236390	War Thunder
3606480	Call of Duty®: Black Ops 7
1049590	Eternal Return
2456740	inZOI
3450310	Europa Universalis V
1289670	EA Play
1466860	Age of Empires IV: Anniversary Edition
2073850	THE FINALS
835570	Conqueror's Blade
3059520	F1® 25
359550	Tom Clancy's Rainbow Six® Siege X
632360	Risk of Rain 2
1086940	Baldur's Gate 3
1665460	eFootball™
2358720	Black Myth: Wukong
266410	iRacing
1203220	NARAKA: BLADEPOINT
1085660	Destiny 2
2661300	Grounded 2
440	Team Fortress 2
1934680	Age of Mythology: Retold
2139460	Once Human
294100	RimWorld
2050650	Resident Evil 4
2622380	ELDEN RING NIGHTREIGN
3230400	EA SPORTS™ Madden NFL 26
3093400	Knightica
1909950	SUPER ROBOT WARS Y
1144200	Ready or Not
1903340	Clair Obscur: Expedition 33
394360	Hearts of Iron IV
367520	Hollow Knight
1203620	Enshrouded
2668080	Snowbreak: Containment Zone
1973530	Limbus Company
1941540	Mafia: The Old Country
1284210	Guild Wars 2
1245620	ELDEN RING
3241660	R.E.P.O.
814380	Sekiro™: Shadows Die Twice - GOTY Edition
39210	FINAL FANTASY XIV Online
1091500	Cyberpunk 2077
313690	LEGO® Batman™ 3: Beyond Gotham
264710	Subnautica
1172710	Dune: Awakening
1286830	STAR WARS™: The Old Republic™
1401590	Disney Dreamlight Valley
413150	Stardew Valley
1222670	The Sims™ 4
3164500	Schedule I
813780	Age of Empires II: Definitive Edition
3228590	Deadzone: Rogue
532790	Vampire: The Masquerade® - Bloodlines™ 2
3472040	NBA 2K26
281990	Stellaris
3035570	Assassin's Creed Mirage
2141910	Magic: The Gathering Arena
1295660	Sid Meier's Civilization VII
2246340	Monster Hunter Wilds
3513350	Wuthering Waves
1962663	Call of Duty®: Warzone™
2001120	Split Fiction
2615540	VOID/BREAKER
227300	Euro Truck Simulator 2
686810	Hell Let Loose
2440510	Forza Motorsport
418370	Resident Evil 7 Biohazard
1721110	Abyssus
534380	Dying Light 2 Stay Human: Reloaded Edition
3489700	Stellar Blade™
236850	Europa Universalis IV
703080	Planet Zoo
1361210	Warhammer 40,000: Darktide
2369390	Far Cry® 6
1671210	DELTARUNE
2133760	Tiny Bookshop
739630	Phasmophobia
3504780	Wildgate
1158310	Crusader Kings III
2399830	ARK: Survival Ascended
427410	Abiotic Factor
239140	Dying Light
582010	Monster Hunter: World
1196590	Resident Evil Village
552990	World of Warships
1643320	S.T.A.L.K.E.R. 2: Heart of Chornobyl
214950	Total War: ROME II - Emperor Edition
3716600	Mage Arena
2300320	Farming Simulator 25
1771300	Kingdom Come: Deliverance II
2537590	Microsoft Flight Simulator 2024
1250410	Microsoft Flight Simulator (2020) 40th Anniversary Edition
2651280	Marvel's Spider-Man 2
284160	BeamNG.drive
2357570	Overwatch® 2
3047750	Herdling
920210	LEGO® Star Wars™: The Skywalker Saga
1617400	The Bazaar
648800	Raft
1449850	Yu-Gi-Oh! Master Duel
427520	Factorio
1342490	Daemon X Machina: Titanic Scion
1547000	Grand Theft Auto: San Andreas – The Definitive Edition
2453160	Sword of the Sea
1174180	Red Dead Redemption 2
2625420	Drive Beyond Horizons
1407200	World of Tanks
1501750	Lords of the Fallen
270880	American Truck Simulator
108600	Project Zomboid
1326470	Sons Of The Forest
1874880	Arma Reforger
690830	Foundation
1623730	Palworld
1782460	Hell Clock
848450	Subnautica: Below Zero
2201320	Date Everything!
2943650	FragPunk
768200	Smalland: Survive the Wilds
3008130	Dying Light: The Beast
2584990	Shadowverse: Worlds Beyond
1063730	New World: Aeternum
2344520	Diablo® IV
526870	Satisfactory
3325500	Worldwide Rush
872670	SCP: 5K
238960	Path of Exile
12210	Grand Theft Auto IV: The Complete Edition
3274580	Anno 117: Pax Romana
1154030	Titan Quest II
601150	Devil May Cry 5
1374490	RuneScape: Dragonwilds
2385530	PGA TOUR 2K25
1669000	Age of Wonders 4
837470	Untitled Goose Game
1244460	Jurassic World Evolution 2
105600	Terraria
1172620	Sea of Thieves: 2025 Edition
2707930	Palia
2947440	SILENT HILL f
1158160	Coral Island
728880	Overcooked! 2
2085540	Stick It to the Stickman
962130	Grounded
949230	Cities: Skylines II
1868360	Deep Sleep: Labyrinth of the Forsaken
3821790	Ys X: Proud Nordics
2407270	AI LIMIT
594650	Hunt: Showdown 1896
3339880	OFF
1366540	Dyson Sphere Program
1446780	MONSTER HUNTER RISE
2739990	Mahjong Soul
3024040	Stronghold Crusader: Definitive Edition
2525310	Drop Duchy
1041320	Lords Mobile: Kingdom Wars
1938090	Call of Duty®
1142710	Total War: WARHAMMER III
3159330	Assassin’s Creed Shadows
2928600	Demon Slayer -Kimetsu no Yaiba- The Hinokami Chronicles 2
346110	ARK: Survival Evolved
518790	theHunter: Call of the Wild™
2183900	Warhammer 40,000: Space Marine 2
2523720	Gears of War: Reloaded
2531310	The Last of Us™ Part II Remastered
933110	Age of Empires III: Definitive Edition
204360	Castle Crashers®
2688950	Planet Coaster 2
2277560	WUCHANG: Fallen Feathers
2215430	Ghost of Tsushima DIRECTOR'S CUT
1486920	Tempest Rising
2878980	NBA 2K25
250900	The Binding of Isaac: Rebirth
829110	LEGO® DC Super-Villains
322330	Don't Starve Together
1404850	Luck be a Landlord
2669320	EA SPORTS FC™ 25
1645820	SurrounDead
2471970	Planetary Life
2717880	The Rogue Prince of Persia
221100	DayZ
325610	Total War: ATTILA
767560	War Robots
3035120	Is This Seat Taken?
2670630	Supermarket Simulator
359320	Elite Dangerous
2379780	Balatro
1313140	Cult of the Lamb
380600	Fishing Planet
2054970	Dragon's Dogma 2
3755860	BLACK SOULS
2101960	Cronos: The New Dawn
383870	Firewatch
2644470	PICO PARK 2
2933620	Call of Duty®: Black Ops 6
251570	7 Days to Die
714010	Aimlabs
2993780	FANTASY LIFE i: The Girl Who Steals Time
1974050	Torchlight: Infinite
2322010	God of War Ragnarök
1282270	Strinova
2426960	Summoners War
244210	Assetto Corsa
1973710	ヘブンバーンズレッド
444200	World of Tanks Blitz
529340	Victoria 3
1562430	DREDGE
885970	Total War: ROME REMASTERED
1284190	The Planet Crafter
1627720	Lies of P
1984270	Digimon Story Time Stranger
489830	The Elder Scrolls V: Skyrim Special Edition
2623190	The Elder Scrolls IV: Oblivion Remastered
952060	Resident Evil 3
892970	Valheim
255710	Cities: Skylines
1943950	Escape the Backrooms
761890	Albion Online
291550	Brawlhalla
976730	Halo: The Master Chief Collection
1435790	Escape Simulator
311210	Call of Duty®: Black Ops III
2753900	The King is Watching
3378960	Lost Soul Aside™
550	Left 4 Dead 2
2486820	Sonic Racing: CrossWorlds
201270	Total War: SHOGUN 2
1260320	Party Animals
883710	Resident Evil 2
257850	Hyper Light Drifter
304390	FOR HONOR™
647830	LEGO® Marvel Super Heroes 2
2366980	Thank Goodness You're Here!
2399420	Le Mans Ultimate
881020	Granblue Fantasy: Relink
2958130	Jurassic World Evolution 3
1145350	Hades II
2141730	Backrooms: Escape Together
1611910	Warhammer 40,000: Chaos Gate - Daemonhunters
2995920	It Takes Two Friend's Pass
230290	Universe Sandbox
2186680	Warhammer 40,000: Rogue Trader
3156770	Witchfire
1778820	TEKKEN 8
1466060	Tainted Grail: The Fall of Avalon
1258080	Shop Titans
1304930	The Outlast Trials
261550	Mount &amp; Blade II: Bannerlord
1966720	Lethal Company
4000	Garry's Mod
375910	Anno 2205™
3055950	Shantae Advance: Risky Revolution
1367590	Tormented Souls
2138720	REMATCH
2933130	The Lord of the Rings: Return to Moria™
286160	Tabletop Simulator
2445690	Lost Castle 2
1426210	It Takes Two
1716740	Starfield
405310	LEGO® MARVEL's Avengers
249130	LEGO® Marvel™ Super Heroes
750130	The Sinking City Remastered
945360	Among Us
1869290	Supraworld
1206560	WorldBox - God Simulator
3101040	魔法少女ノ魔女裁判
960090	Bloons TD 6
1607250	MY HERO ULTRA RUMBLE
787480	Phoenix Wright: Ace Attorney Trilogy
2552450	KINGDOM HEARTS III + Re Mind (DLC)
1149460	ICARUS
377160	Fallout 4
2787320	Revenge of the Savage Planet
3097560	Liar's Bar
374320	DARK SOULS™ III
3116890	Out of the Park Baseball 26
1604270	Broken Arrow
2916430	Fast Food Simulator
3028310	Nordhold
1286220	Sea Power : Naval Combat in the Missile Age
2567870	Chained Together
3371770	Funguys Swarm
1144400	Senren＊Banka
504230	Celeste
2379740	Wizardry Variants Daphne
2725260	ENDER MAGNOLIA: Bloom in the Mist
2221490	Tom Clancy’s The Division® 2
3164330	Infinity Nikki
1272320	Diplomacy is Not an Option
2849080	Kingdom Rush 5: Alliance TD
1902960	Lost Records: Bloom &amp; Rage
2414270	Sunderfolk
766570	Russian Fishing 4
440900	Conan Exiles
2437170	SMITE 2
1262350	SIGNALIS
611760	Don't Escape: 4 Days to Survive
1202200	Paleo Pines
2484110	FINAL FANTASY VII EVER CRISIS
1726190	No Straight Roads: Encore Edition
1135690	Unpacking
1190970	House Flipper 2
1283700	SUPERVIVE
1190000	Car Mechanic Simulator 2021
2366970	Arco
211500	RaceRoom Racing Experience
2680010	The First Berserker: Khazan
2104890	RoadCraft
2479810	Gray Zone Warfare
1888930	The Last of Us™ Part I
268910	Cuphead
2252570	Football Manager 2024
242760	The Forest
990080	Hogwarts Legacy
1629520	A Little to the Left
1818450	STALCRAFT: X
1392860	Little Nightmares III
631510	Devil May Cry HD Collection
2776900	The Eminence in Shadow: Master of Garden
21690	Resident Evil 5
1004640	FINAL FANTASY TACTICS - The Ivalice Chronicles
2203070	Dragonheir: Silent Gods
2436940	Sephiria
1369630	ENDER LILIES: Quietus of the Knights
1290000	PowerWash Simulator
1066780	Transport Fever 2
3199170	Blood Strike
2406770	Bodycam
221040	Resident Evil 6
1114150	CarX Street
880940	Pummel Party
1928420	Farlight 84
1671200	Honkai Impact 3rd
2904000	The Spell Brigade
753640	Outer Wilds
2185060	Two Point Museum
2361770	SHINOBI: Art of Vengeance
1817070	Marvel’s Spider-Man Remastered
3017860	DOOM: The Dark Ages
22380	Fallout: New Vegas
2768430	ATLYSS
2631450	Bean Beasts
1056640	Phantasy Star Online 2 New Genesis
1473480	A.V.A Global
1367080	MOBILE SUIT GUNDAM BATTLE OPERATION 2
289070	Sid Meier’s Civilization® VI
1430190	Killing Floor 3
3671710	Touhou Kinjoukyou ～ Fossilized Wonders.
1333350	Angel Legion
204100	Max Payne 3
1229490	ULTRAKILL
2066020	Soulstone Survivors
48190	Assassin’s Creed® Brotherhood
2333480	RAID: Shadow Legends
1357860	Fuga: Melodies of Steel
1040200	Crime Scene Cleaner
1465360	SnowRunner
2349820	Hero's Land
3141310	Inkshade
2404880	Car Dealer Simulator
208650	Batman™: Arkham Knight
2737070	Crime Simulator
1534840	Hyper Light Breaker
799960	Wizard101
275850	No Man's Sky
2016460	Tales of the Shire: A The Lord of The Rings™ Game
2001340	Fuga: Melodies of Steel 2
2124490	SILENT HILL 2
1659040	HITMAN World of Assassination
223750	DCS World Steam Edition
457140	Oxygen Not Included
2384580	DYNASTY WARRIORS: ORIGINS
625960	Stoneshard
2226730	OVIS LOOP
48240	Anno 2070™
9900	Star Trek Online
1569580	Blue Prince
1217060	Gunfire Reborn
431240	Golf With Your Friends
620980	Beat Saber
1604030	V Rising
322170	Geometry Dash
3557620	Blue Archive
391540	Undertale
1238840	Battlefield™ 1
3070070	TCG Card Shop Simulator
3338950	The Scouring
3769130	Keep on Mining!
2545710	Tony Hawk's™ Pro Skater™ 3 + 4
633230	NARUTO TO BORUTO: SHINOBI STRIKER
2678640	Journey of Realm：Dawn Dew
2452280	Mecha BREAK
1631470	Critter Cove
2509200	ERA ONE
2881650	Content Warning
805550	Assetto Corsa Competizione
985810	GrandChase
1337520	Risk of Rain Returns
548430	Deep Rock Galactic
552520	Far Cry® 5
1363080	Manor Lords
594570	Total War: WARHAMMER II
513710	SCUM
2116120	Incursion Red River
1969870	Battle Teams 2
1343400	RuneScape ®
1812860	Dice Gambit
2424010	Parcel Simulator
214510	LEGO® The Lord of the Rings™
1868140	DAVE THE DIVER
1248130	Farming Simulator 22
1476970	IdleOn - The Idle RPG
1240440	Halo Infinite
2835570	Buckshot Roulette
329050	Devil May Cry 4 Special Edition
2190220	Touhou Danmaku Kagura Phantasia Lost
201870	Assassin's Creed® Revelations
824270	KovaaK's
1367550	Kingdom Rush Vengeance - Tower Defense
376210	The Isle
2824490	He is Coming
285160	LEGO® The Hobbit™
2677660	Indiana Jones and the Great Circle
107410	Arma 3
1462040	FINAL FANTASY VII REMAKE INTERGRADE
3446920	Mecharashi
2941710	Project Silverfish
233860	Kenshi
1017900	Age of Empires: Definitive Edition
1539140	STONKS-9800: Stock Market Simulator
352400	LEGO® Jurassic World
570940	DARK SOULS™: REMASTERED
641990	The Escapists 2
412020	Metro Exodus
2155180	Pioneers of Pagonia
1447820	The Girl from Arkanya
1548850	Six Days in Fallujah
493340	Planet Coaster
1129580	Medieval Dynasty
573090	Stormworks: Build and Rescue
2447680	Island Notes
1953230	Whisper Mountain Outbreak
292030	The Witcher 3: Wild Hunt
1687950	Persona 5 Royal
287700	METAL GEAR SOLID V: THE PHANTOM PAIN
397540	Borderlands 3
285190	Warhammer 40,000: Dawn of War III
646570	Slay the Spire
2967990	Train Sim World® 5
2288630	Taiko no Tatsujin: Rhythm Festival
3123120	Kill the Brickman
1527950	Wartales
655500	MX Bikes
1281630	Anno 1404 - History Edition
1620730	Hell is Us
218620	PAYDAY 2
1145360	Hades
3809110	Japan Stigmatized Property -日本事故物件監視協会-
49520	Borderlands 2
3906770	HorrorToleranceTest
1794680	Vampire Survivors
3052450	Morimens
339340	Resident Evil 0
3645890	GONE Fishing
400750	Call to Arms - Gates of Hell - Ostfront
2142790	Fields of Mistria
2784470	9 Kings
1790600	DRAGON BALL: Sparking! ZERO
293760	Automation - The Car Company Tycoon Game
393380	Squad
2198150	Tiny Glade
2325290	Sky: Children of the Light
2208570	Dark Hours
544810	KARDS - The WW2 Card Game
1343370	Old School RuneScape
588650	Dead Cells
2524890	Pixel Gun 3D: PC Edition
1812450	Bellwright
3672720	Prison Escape Simulator: Dig Out
3630410	Little Witch Survivors
2495100	Hello Kitty Island Adventure
1601570	The Alters
1575940	Sins of a Solar Empire II
438640	LEGO® STAR WARS™: The Force Awakens
2864560	Rune Factory: Guardians of Azuma
1013320	Firestone - Online Idle RPG
1336490	Against the Storm
2135150	Elin
2764370	Starward
386180	Crossout
3104410	Terminull Brigade™
1164940	Trepang2
1167630	Teardown
1971870	Mortal Kombat 1
1621690	Core Keeper
546560	Half-Life: Alyx
589290	Holdfast: Nations At War
2627260	NINJA GAIDEN 4
3117820	Sultan's Game
371970	Barony
1593500	God of War
516750	My Summer Car
1321440	Cassette Beasts
2742830	Monster Train 2
1942280	Brotato
1796470	Haste
1641960	Forever Skies
219990	Grim Dawn
629730	Blade and Sorcery
3400930	Guilty as Sock!
2213190	DEATH NOTE Killer Within
492720	Tropico 6
238320	Outlast
2820140	Anno 1701 History Edition
2468730	Dungeon Stalkers
304240	Resident Evil
1669980	Volcano Princess
244850	Space Engineers
2569510	MLB Rivals
1657630	Slime Rancher 2
410340	Liftoff®: FPV Drone Racing
1922560	Plants vs. Zombies™ Garden Warfare 2: Deluxe Edition
505460	Foxhole
436150	Governor of Poker 3
3092660	Reverse: 1999
1689620	BLEACH Rebirth of Souls
3011360	Primordialis
2834910	Rocksmith+
1222140	Detroit: Become Human
202970	Call of Duty®: Black Ops II
212500	The Lord of the Rings Online™
200210	Realm of the Mad God Exalt
1583230	High On Life
1331550	Big Ambitions
1888160	ARMORED CORE™ VI FIRES OF RUBICON™
2820130	Anno 1602 History Edition
774361	Blasphemous
1211630	The Jackbox Party Pack 7
3730100	Whispers from the Star
2878960	WWE 2K25
2572400	Kingdom, Dungeon, and Hero
47890	The Sims™ 3
2420110	Horizon Forbidden West™ Complete Edition
24010	Train Simulator Classic 2024
1876890	Wandering Sword
1274570	DEVOUR
3728120	SpaceCorp: 2025-2300AD
578330	LEGO® City Undercover
392160	X4: Foundations
2820110	Anno 1503 History Edition
435150	Divinity: Original Sin 2 - Definitive Edition
1449110	The Outer Worlds 2
2695940	PANICORE
2780980	LOCKDOWN Protocol
1105420	Game of Thrones Winter is Coming
3347400	GIRLS' FRONTLINE 2: EXILIUM
2131680	METAL GEAR &amp; METAL GEAR 2: Solid Snake
1677280	Company of Heroes 3
1556200	Predator: Hunting Grounds
1238860	Battlefield 4™
960170	DJMAX RESPECT V
2915380	Ways of Alchemy
3174070	Texas Hold'em Poker: Pokerist
2051620	Enlisted
620	Portal 2
1898300	ASKA
1468810	鬼谷八荒 Tale of Immortal
1335200	Action Taimanin
16900	GROUND BRANCH
881100	Noita
2763740	Revolution Idle
3314070	The Sims™ 2 Legacy Collection
3059070	The Headliners
1827180	Toram Online
491540	The Bus
1520470	Soul Dossier
3805420	A Few Quick Matches
508440	Totally Accurate Battle Simulator
3263320	Carry The Glass
1584090	Touhou Mystia's Izakaya
2617700	Tinkerlands
1432860	Sun Haven
2187220	Apollo Justice: Ace Attorney Trilogy
2591280	F1® Manager 2024
997010	Police Simulator: Patrol Officers
2157560	Granblue Fantasy Versus: Rising
585420	Trailmakers
304050	Trove
1280930	Astral Ascent
1850570	DEATH STRANDING DIRECTOR'S CUT
606150	Moonlighter
2169200	Sniper Elite: Resistance
1062520	Dinkum
364360	Total War: WARHAMMER
1332010	Stray
2527500	MiSide
1355090	RAILGRADE
55150	Warhammer 40,000: Space Marine - Anniversary Edition
3581600	Fate War
2383200	PATAPON 1+2 REPLAY
2014780	X-Plane 12
3444020	Demonic Mahjong
1433140	The Texas Chain Saw Massacre
958400	Project CARS 3
663090	Granado Espada
2212670	MakeRoom
1815780	Asphalt Legends
2161700	Persona 3 Reload
246620	Plague Inc: Evolved
2542120	NINJA GAIDEN: Ragebound
2530470	Garden of Witches
471710	Rec Room
2347080	Frosthaven
815370	Green Hell
438040	Shakes and Fidget
21130	LEGO® Harry Potter: Years 1-4
818320	LEGO® The Incredibles
1189490	觅长生
3226530	Tower Dominion
2840770	Avatar: Frontiers of Pandora™
1607680	Bread &amp; Fred
3456800	Rock Crusher
1159690	Voidtrain
2401970	Ace Attorney Investigations Collection
3483740	Cast n Chill
3587610	The Dark Queen of Mortholme
1238810	Battlefield™ V
267530	The LEGO® Movie - Videogame
1929610	Demonologist
8500	EVE Online
3247750	Mycopunk
1180320	War of the Three Kingdoms
2515020	FINAL FANTASY XVI
2909400	FINAL FANTASY VII REBIRTH
214490	Alien: Isolation
1809540	Nine Sols
1672970	Minecraft Dungeons
3590	Plants vs. Zombies GOTY Edition
3014080	The Hundred Line -Last Defense Academy-
1750770	Starcom: Unknown Space
2058730	The Darkest Files
253230	A Hat in Time
3372710	Noble Legacy
3609170	4STORY : The Original
252530	OMSI 2: Steam Edition
1580790	[NINJA GAIDEN: Master Collection] NINJA GAIDEN Σ2
3800340	ScootX
895870	Project Wingman
1682970	Uncrashed : FPV Drone Simulator
2215390	Five Nights at Freddy's: Secret of the Mimic
1594320	Captain of Industry
1133870	Space Engineers 2
2521380	Legacy of Kain™ Soul Reaver 1&2 Remastered
2679460	Metaphor: ReFantazio
1839950	Terminator: Dark Fate - Defiance
2668510	Red Dead Redemption
291480	Warface: Clutch
1184370	Pathfinder: Wrath of the Righteous - Enhanced Edition
1671570	Out and About
613100	House Flipper
1066890	Automobilista 2
1137300	Sherlock Holmes Chapter One
233450	Prison Architect
1150690	OMORI
312520	Rain World
3224420	Milky Way Idle
886250	Vegas Infinite by PokerStars
812140	Assassin's Creed® Odyssey
1357210	Galactic Civilizations IV
2622000	Astral Party
1817190	Marvel’s Spider-Man: Miles Morales
3003460	Bang Bang Barrage
2208920	Assassin's Creed Valhalla
1288320	Way of the Hunter
2680550	Hollywood Animal
699130	World War Z
690790	DiRT Rally 2.0
779340	Total War: THREE KINGDOMS
1442430	Storage Hunter Simulator
2000950	Call of Duty®: Modern Warfare®
977950	A Dance of Fire and Ice
204120	LEGO® Harry Potter: Years 5-7
2653940	Star Trek: Resurgence
489630	Warhammer 40,000: Gladius - Relics of War
2552440	KINGDOM HEARTS HD 2.8 Final Chapter Prologue
424030	War of Rights
305620	The Long Dark
2217000	Rivals of Aether II
239030	Papers, Please
851850	DRAGON BALL Z: KAKAROT
1371980	No Rest for the Wicked
287290	Resident Evil Revelations 2
926990	WolfQuest: Anniversary Edition
744900	Dead Frontier 2
2646460	Soulmask
42700	Call of Duty®: Black Ops
667970	VTOL VR
1434950	HighFleet
1324780	Easy Red 2
1282100	REMNANT II®
1489630	Carrier Command 2
2393160	Nice Day for Fishing
3116730	BIG LOOT
568220	Lobotomy Corporation | Monster Management Simulation
220200	Kerbal Space Program
552500	Warhammer: Vermintide 2
477160	Human Fall Flat
1949030	Sherlock Holmes The Awakened
1824220	Chivalry 2
1335830	Len's Island
1997040	MARVEL SNAP
2231380	Tom Clancy's Ghost Recon® Breakpoint
3454650	BitCraft Online
2827230	Wild Assault
1030840	Mafia: Definitive Edition
1044720	Farthest Frontier
3604030	Wolf Mate
1259420	Days Gone
1850960	The Jackbox Party Pack 9
282140	SOMA
1477590	EZ2ON REBOOT : R
333640	Caves of Qud
361420	ASTRONEER
445980	Wizard of Legend
3524160	Crescent Tower
1721470	Poppy Playtime
2511310	Pro Cycling Manager 25
1592190	BONELAB
2239710	Into the Dead: Our Darkest Days
635260	CarX Drift Racing Online
1976440	CounterSide
356190	Middle-earth™: Shadow of War™
2114740	Blasphemous 2
2273430	BlazBlue Entropy Effect
2918150	ONE PIECE Bounty Rush
1601580	Frostpunk 2
756800	Contraband Police
994280	Gujian3(古剑奇谭三)
8930	Sid Meier's Civilization® V
2696050	Yarimono
2321470	Deep Rock Galactic: Survivor
3021100	Five Hearts Under One Roof
774171	Muse Dash
2016590	Dark and Darker
209000	Batman™: Arkham Origins
327030	Worms W.M.D
816340	Kingdom Rush Origins - Tower Defense
745920	Temtem
1100140	Touhou Fuujinroku ~ Mountain of Faith.
2212330	Your Only Move Is HUSTLE
1881700	Undawn
1702010	Sengoku Dynasty
1273400	Construction Simulator
669330	Mechabellum
569480	Kingdoms and Castles
254700	Resident Evil 4 (2005)
1735700	Back to the Dawn
454650	DRAGON BALL XENOVERSE 2
961200	Predecessor
1239080	Door Kickers 2: Task Force North
3614460	Hypermarket Simulator
2527390	Dead Rising Deluxe Remaster
3373660	Look Outside
784080	MechWarrior 5: Mercenaries
2009350	Out of Ore
313120	Stranded Deep
983970	Haven
3093050	Kill The Music
2764750	The Other Side
2667120	Ballionaire
2308690	Ground of Aces
314650	SpaceEngine
1599600	PlateUp!
203770	Crusader Kings II
1170570	The Drifter
1222700	A Way Out
222480	Resident Evil Revelations
2701720	Wagotabi: A Japanese Journey
1967430	Ghost Trick: Phantom Detective
2427700	Backpack Battles
939960	Far Cry® New Dawn
2488370	Cash Cleaner Simulator
246420	Kingdom Rush  - Tower Defense
15100	Assassin's Creed™: Director's Cut Edition
1940340	Darkest Dungeon® II
379430	Kingdom Come: Deliverance
3336520	Dinotica
242050	Assassin’s Creed® IV Black Flag™
2634950	Tokyo Xtreme Racer
3654560	Plants vs. Zombies™: Replanted
784150	Workers &amp; Resources: Soviet Republic
2106670	Gatekeeper
2076010	UNDER NIGHT IN-BIRTH II Sys:Celes
509980	BIGFOOT
2086430	NIMRODS
648350	Jurassic World Evolution
624270	The Painscreek Killings
458710	Kingdom Rush Frontiers - Tower Defense
460930	Tom Clancy's Ghost Recon® Wildlands
265550	Dead Rising 3 Apocalypse Edition
1533390	Gorilla Tag
1864000	Artis Impact
1118200	People Playground
433340	Slime Rancher
3327640	hololive Holo's Hanafuda
1256670	Library Of Ruina
362890	Black Mesa
2600	Vampire: The Masquerade - Bloodlines
24200	DC Universe™ Online
1552350	The Jackbox Party Pack 8
386940	Ultimate Chicken Horse
2239150	Thronefall
17390	SPORE™
1254120	Bless Unleashed
1216320	Shieldwall
4570	Warhammer 40,000: Dawn of War - Anniversary Edition
1029690	Sniper Elite 5
611790	House Party
1030830	Mafia II: Definitive Edition
2853590	Void War
1659420	UNCHARTED™: Legacy of Thieves Collection
2674290	Kings Call
1005300	The Jackbox Party Pack 6
493520	GTFO
1203190	Wreckfest 2
1082430	Before Your Eyes
434170	The Jackbox Party Pack 3
445220	Avorion
2776450	Multiverse Loot Hunter
602960	Barotrauma
2698940	The Crew Motorfest
2235200	Neon Abyss 2
1931180	Lost Skies
2162800	shapez 2
1295920	The Mortuary Assistant
2172010	Until Dawn™
219150	Hotline Miami
3528450	纸房子
1351080	Pharaoh™: A New Era
2167580	Summoners War: Chronicles
424840	Little Nightmares
2176130	Tower! Simulator 3
581320	Insurgency: Sandstorm
698670	Scorn
476600	Call of Duty® WWII
666150	Prehistoric Kingdom
588030	Derail Valley
2377280	Eriksholm: The Stolen Dream
427730	Who's Your Daddy?!
593600	PixARK
360430	Mafia III: Definitive Edition
1454400	Cookie Clicker
2660460	Aviassembly
262060	Darkest Dungeon®
2730810	EVERYBODY'S GOLF HOT SHOTS
1624540	Storyteller
1092790	Inscryption
2457220	Avowed
1369670	Motor Town: Behind The Wheel
10180	Call of Duty®: Modern Warfare® 2 (2009)
10090	Call of Duty: World at War
3371240	Beyond Citadel
3286930	Heretic + Hexen
2604480	City Transport Simulator®
718670	Cultist Simulator
1649950	News Tower
2225070	Trackmania
2396990	Fate/hollow ataraxia REMASTERED
2124120	SULFUR
1294760	HARD BULLET
466560	Northgard
1368820	RollerCoaster Tycoon® 3: Complete Edition
206480	Dungeons &amp; Dragons Online®
1336980	NOBUNAGA'S AMBITION: Awakening
2658510	Animal Shelter 2
917950	Vellum
335300	DARK SOULS™ II: Scholar of the First Sin
1638160	Altheia: The Wrath of Aferi
490110	The Precinct
502500	ACE COMBAT™ 7: SKIES UNKNOWN
1237950	STAR WARS™ Battlefront™ II
2926900	MAVRIX by Matt Jones
1611600	WARNO
1573360	Infinity Kingdom
1072040	Panzer Corps 2
780310	The Riftbreaker
3628960	Miscrits: World of Creatures
552100	Brick Rigs
2238470	Grimshire
1778840	Spirit of the North 2
747660	Five Nights at Freddy's: Security Breach
1944430	Amnesia: The Bunker
3198850	Play Together
1286990	CONSCRIPT
2698780	ContractVille
1292630	3on3 FreeStyle: Rebound
1084600	My Time at Sandrock
2080690	Sunkenland
751780	Forager
1989270	Slay the Princess — The Pristine Cut
3690010	Who's at the door?
2561580	Horizon Zero Dawn™ Remastered
601510	Yu-Gi-Oh! Duel Links
1097580	CUSTOM ORDER MAID 3D2 It's a Night Magic
3569500	Card Shop Simulator Multiplayer
2071280	Ravenswatch
495420	State of Decay 2: Juggernaut Edition
3058630	Assetto Corsa EVO
459820	Crush Crush
1543030	Sword and Fairy 7
2721890	Öoo
1557740	ROUNDS
299970	Project Motor Racing
975370	Dwarf Fortress
1766060	HumanitZ
794600	LET IT DIE
349040	NARUTO SHIPPUDEN: Ultimate Ninja STORM 4
10	Counter-Strike
475150	Titan Quest Anniversary Edition
3363270	Fischer's Fishing Journey
1509960	PICO PARK
2819520	Viking Rise
784950	SUPREMACY: WORLD WAR 3
3411510	Stellar Code
3751730	Loan Shark
860510	Little Nightmares II
1985810	Call of Duty®: Black Ops Cold War
500	Left 4 Dead
3285500	Three Kingdoms Mushouden
218230	PlanetSide 2
1465460	Infection Free Zone
2853730	Skull and Bones
2475490	Mouthwashing
3527760	RoboCop: Rogue City - Unfinished Business
248820	Risk of Rain (2013)
493490	City Car Driving
3124310	BOULDER DASH 40th Anniversary
674940	Stick Fight: The Game
2683150	Ale &amp; Tale Tavern
872410	ROMANCE OF THE THREE KINGDOMS XIV
464920	Surviving Mars
1149620	Gas Station Simulator
2703850	Rooftops &amp; Alleys: The Parkour Game
242550	Rayman® Legends
774461	The Jackbox Party Pack 5
1570010	FAR: Changing Tides
285900	Gang Beasts
1716310	AWAKEN - Astral Blade
1151640	Horizon Zero Dawn™ Complete Edition
2367820	despelote
1272080	PAYDAY 3
2471100	Unnamed Space Idle
3583790	Virtual Skate
3020510	Legend of Heroes: Three Kingdoms
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
