// Insert passage text for the 9 orphaned passageIds
// Each passage ~250-350 words, containing the sentences referenced in questions

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'questionData', 'englishData.js');
let content = fs.readFileSync(filePath, 'utf8');

const passages = {
  'saving-hedgehogs': `Every autumn, wildlife charities across Britain launch campaigns to help one of our most beloved creatures: the hedgehog. Once a common sight in gardens and hedgerows, hedgehog numbers have fallen dramatically over the past twenty years. Scientists estimate that the British hedgehog population has declined from around thirty million in the 1950s to fewer than one million today.

Hedgehogs sleep through the cold winter months, curling into tight balls inside nests of dry leaves hidden beneath sheds, log piles, and thick hedgerows. This deep sleep, called hibernation, allows them to survive when their food — slugs, beetles, caterpillars, and earthworms — is scarce. Before hibernating, a hedgehog must weigh at least 600 grams, or it may not have enough energy to last until spring.

The biggest threat to hedgehogs is not cold weather but the loss of the rough, wild patches of ground where they find food and shelter. Modern gardens with close-boarded fences, tidy lawns, and concrete patios offer little for a hungry hedgehog. Conservation groups encourage people to cut small holes in their garden fences — 'hedgehog highways' — so the animals can roam freely between gardens at night. Leaving a shallow dish of water and a pile of leaves in a quiet corner can make a real difference.

Volunteers across the country also rescue underweight hedgehogs found wandering in daylight, nursing them through the winter in heated shelters before releasing them in spring. It is painstaking, gentle work, but for those involved, the sight of a healthy hedgehog shuffling back into the undergrowth makes every effort worthwhile.`,

  'secret-hedgehogs': `Most people have never watched a hedgehog at work, and for good reason: hedgehogs are almost entirely nocturnal. They emerge after dark, snuffling through gardens, parks, and woodland edges in search of food. They build warm nests from dry leaves and grass, tucking themselves into sheltered spots during the day where they sleep soundly, invisible to the world above.

A hedgehog's night begins at dusk. Using its remarkably sharp sense of smell — far more powerful than a human's — it follows invisible trails left by slugs, beetles, and earthworms. A single hedgehog can travel up to two kilometres in one night, covering a home range that might include a dozen gardens. It moves with surprising purpose, following the same routes night after night, squeezing through gaps in fences and under gates with practised ease.

The hedgehog's most famous feature is, of course, its spines — around seven thousand of them, each one a modified hair made of keratin, the same material as human fingernails. When threatened, a hedgehog rolls into a tight ball, presenting a prickly fortress that deters most predators. Badgers, however, are strong enough to uncurl a hedgehog, which is one reason why hedgehog numbers tend to be lower in areas with large badger populations.

As dawn approaches, the hedgehog returns to its nest, curls up, and sleeps. The garden looks perfectly ordinary in the morning light, giving no sign of the busy little creature that spent the whole night patrolling it. This is why the author calls hedgehogs' lives 'secret' — their entire world unfolds while we are asleep.`,

  'florence-nightingale': `In the winter of 1854, a young English nurse named Florence Nightingale arrived at the British military hospital in Scutari, Turkey. What she found horrified her. Wounded soldiers from the Crimean War lay on filthy floors, without clean bandages, proper food, or basic medicines. Infection spread rapidly through the overcrowded wards, and more men were dying from disease than from their battlefield injuries.

Florence immediately set about transforming the hospital. She tended the wounded soldiers with great care, organising teams of nurses to scrub the wards clean, wash bed linen, and prepare nutritious meals. She insisted on proper ventilation, clean water, and fresh supplies — measures that seem obvious today but were revolutionary at the time. Within months, the death rate at Scutari had fallen dramatically.

What made Florence famous, however, was not just her medical skill but her extraordinary dedication. She worked from dawn until long after midnight, and each night she walked the hospital corridors carrying a Turkish lamp, checking on patients who could not sleep. The soldiers called her 'The Lady with the Lamp,' and the image became one of the most recognised symbols of nursing in history.

Florence Nightingale returned to England as a national heroine. She spent the rest of her long life campaigning to improve hospital conditions, training nurses at the school she founded at St Thomas' Hospital in London, and writing influential books on public health. She proved that careful observation, cleanliness, and compassion could save thousands of lives — and she changed the practice of medicine forever.`,

  'lightning': `On a hot summer afternoon, when the air feels thick and heavy, dark clouds begin to pile up along the horizon. Inside those towering clouds, an extraordinary process is taking place. Tiny ice crystals and water droplets collide with tremendous force, building up enormous electrical charges — positive at the top of the cloud, negative at the bottom. When the difference becomes too great, nature releases it in one of its most spectacular displays: a crack of white fire splitting the sky.

Lightning strikes are both dangerous and fascinating. A single bolt can reach temperatures of 30,000 degrees Celsius — roughly five times hotter than the surface of the sun. It travels at speeds of up to 270,000 miles per hour and can carry 300 million volts of electricity. The thunder we hear is the sound of air expanding explosively as the lightning superheats it, creating a shockwave that rumbles across the landscape.

Britain experiences around 300,000 lightning strikes each year, mostly during summer months when warm, moist air rises rapidly to form cumulonimbus clouds. The safest place during a thunderstorm is inside a building or a car, whose metal frame conducts the electricity safely around the occupants. Standing under a tree is extremely dangerous, as trees are often the tallest objects in a landscape and attract lightning strikes.

Despite its dangers, lightning plays a vital role in nature. It helps produce nitrogen compounds that fertilise the soil, and the fires it starts in wild landscapes can clear old growth and allow new plants to flourish. Scientists continue to study lightning using high-speed cameras and rocket-triggered experiments, but much about this dazzling phenomenon remains mysterious.`,

  'ancient-woodlands': `Scattered across Britain are patches of forest that have stood, unbroken, since at least the year 1600 — and many are far older than that. These remarkable forests have survived for thousands of years, predating the Norman Conquest, the Roman invasion, and in some cases even the arrival of farming in these islands. They are called ancient woodlands, and they are among the most precious and irreplaceable habitats in the country.

Ancient woodlands are home to an extraordinary variety of life. Their soils, undisturbed for centuries, contain complex networks of fungi that connect tree roots underground, allowing trees to share nutrients and even warn each other of pest attacks. Bluebells, wood anemones, and wild garlic carpet the floor each spring — plants that spread so slowly they are reliable indicators of truly ancient ground. If you see a bluebell wood, the chances are that woodland has been there for at least four hundred years.

The trees themselves tell remarkable stories. Many ancient woodlands were traditionally managed by coppicing — cutting trees near the base and allowing them to regrow multiple stems. Some coppiced trees have root systems that are over a thousand years old, even though the visible stems are much younger. These living monuments connect us directly to the medieval craftsmen who harvested their wood for fuel, fencing, and building.

Despite legal protections, ancient woodlands remain under threat from development, road building, and the spread of invasive species. Conservation groups argue that once destroyed, an ancient woodland cannot be recreated — the intricate web of life it supports took centuries to develop and cannot be replanted.`,

  'night-sky': `On a clear night, far from the glow of street lights and towns, the sky transforms into a vast, glittering display. The stars twinkled brightly above the quiet countryside, and for thousands of years, humans have gazed upward in wonder, telling stories about the patterns they saw among the stars.

The easiest pattern to recognise in the British night sky is the Plough — seven bright stars forming the shape of a saucepan, which is part of a larger constellation called Ursa Major, the Great Bear. By following the two stars at the end of the Plough's 'blade' upward, you can find Polaris, the North Star, which sits almost directly above the North Pole and has guided travellers and sailors for centuries.

The best time to observe the night sky is during a new moon, when the moon's light does not wash out fainter stars. Winter nights, though cold, offer some of the clearest viewing conditions and the most spectacular constellations, including Orion the Hunter with his distinctive belt of three bright stars. In summer, the Milky Way — our own galaxy seen from the inside — stretches across the sky like a pale, luminous river.

Light pollution is the biggest enemy of stargazing. In towns and cities, fewer than a hundred stars may be visible, compared to several thousand in a truly dark location. Dark sky reserves, such as Northumberland International Dark Sky Park, protect areas where artificial light is minimised, allowing visitors to experience the night sky as our ancestors once saw it.`,

  'raindrop-journey': `High above the fields of southern England, a small grey cloud drifts on the autumn wind. Inside it, millions of tiny water droplets cling to specks of dust, each one too light to fall. But as the cloud rises and cools, the droplets merge and grow heavier. The tiny raindrop fell from the grey cloud, tumbling through the air, bouncing off a leaf, and landing with a soft splash in a puddle on the footpath below.

This is just the beginning of the raindrop's remarkable journey. From the puddle, it trickles into a drainage ditch, then into a small stream that winds through a farmer's field. The stream joins a river, which flows through villages and towns, under stone bridges and past old mills, gathering water from hundreds of other streams along the way. By the time it reaches the coast, the river is wide and slow, carrying our raindrop out into the salty waters of the English Channel.

But the journey does not end at the sea. Warmed by the sun, water molecules at the ocean's surface gain enough energy to escape into the air as invisible water vapour — a process called evaporation. Rising on warm currents of air, the vapour cools and condenses around tiny particles of dust or salt, forming new cloud droplets. The cycle begins again.

This endless loop — evaporation, condensation, precipitation, and collection — is called the water cycle, and it has been running without interruption for billions of years. Every glass of water you drink contains molecules that have been rain, river, ocean, and cloud countless times before.`,

  'fastest-animal': `When people think of fast animals, they usually picture a cheetah sprinting across the African savannah. The cheetah is indeed the fastest animal on land, capable of reaching 70 miles per hour in short bursts. But the true speed champion of the animal kingdom is a bird — and it lives right here in Britain.

The peregrine falcon dives at extraordinary speed, tucking its wings tight against its body and plunging toward its prey in a hunting manoeuvre called a stoop. During a stoop, a peregrine can exceed 240 miles per hour, making it the fastest animal ever recorded. To put that in perspective, it is faster than a Formula One car and nearly as fast as a skydiver in freefall.

How does the peregrine survive such extreme speeds? Its body is superbly adapted for the task. A bony ridge above each eye acts as a sun visor, reducing glare. Special baffles in its nostrils slow the airflow so it can breathe during the dive. Its feathers are stiff and streamlined, reducing drag, and its powerful chest muscles allow it to pull out of the dive and strike its target — usually a pigeon or other bird — with devastating precision.

Peregrine falcons nearly disappeared from Britain in the 1960s due to pesticide poisoning, but a long-running conservation programme has brought them back. Today, peregrines nest not only on sea cliffs and mountain crags but also on the ledges of city buildings, cathedrals, and tower blocks, where they hunt the plentiful pigeons below. In many cities, webcams allow the public to watch peregrine families raise their chicks each spring.`,

  'pharaohs': `For over three thousand years, the pharaohs of ancient Egypt ruled one of the most powerful civilisations the world has ever known. They built enormous pyramids, carved temples into mountainsides, and filled their tombs with treasures of breathtaking beauty. Then, as Egypt's power faded, the desert sands slowly buried their monuments, and the secrets of the pharaohs were lost to the world for centuries.

Archaeologists discovered the tomb beneath the sand in a series of extraordinary excavations that began in the early nineteenth century. The most famous discovery came in 1922, when the British archaeologist Howard Carter found the tomb of Tutankhamun in the Valley of the Kings. Unlike most royal tombs, which had been emptied by grave robbers centuries earlier, Tutankhamun's burial chamber was almost completely intact. Inside lay a solid gold coffin, a magnificent death mask, jewellery, weapons, furniture, and even preserved food — over five thousand objects in total.

The discovery caused a worldwide sensation. Newspapers ran breathless headlines, and 'Tut-mania' swept across Europe and America. The treasures revealed the astonishing skill of ancient Egyptian craftsmen and provided invaluable information about royal life, religious beliefs, and burial customs. Scientists have since used X-rays, CT scans, and DNA analysis to learn more about Tutankhamun himself — a young king who died at just nineteen, probably from a combination of malaria and a broken leg.

Today, the treasures of Tutankhamun are displayed at the Grand Egyptian Museum in Cairo, where they continue to fascinate visitors from around the world. The pharaohs may have been gone for two thousand years, but their legacy endures in stone, gold, and the endless curiosity of those who seek to understand them.`
};

let fixCount = 0;
for (const [passageId, passageText] of Object.entries(passages)) {
  // Find all questions with this passageId that are missing passage text
  const pattern = '"passageId": "' + passageId + '"';
  let searchFrom = 0;

  while (true) {
    const idx = content.indexOf(pattern, searchFrom);
    if (idx === -1) break;
    searchFrom = idx + pattern.length;

    // Check if passage already exists nearby (within next 200 chars)
    const after = content.substring(idx, idx + 500);
    if (after.includes('"passage"') || after.includes('"passage":') || after.includes('passage`:')) {
      continue; // already has passage
    }

    // Find the passageTitle line after passageId
    const titleIdx = after.indexOf('"passageTitle"');
    if (titleIdx === -1) continue;
    const titleLineEnd = content.indexOf('\n', idx + titleIdx);

    // Insert passage after passageTitle line
    const indent = '          ';
    const insertion = '\n' + indent + '"passage": `' + passageText + '`,';
    content = content.substring(0, titleLineEnd) + insertion + content.substring(titleLineEnd);
    fixCount++;
    searchFrom = titleLineEnd + insertion.length; // advance past insertion
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Inserted', fixCount, 'passages for', Object.keys(passages).length, 'passageIds');
