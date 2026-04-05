import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
    // Admin user
    const adminHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: { passwordHash: adminHash, role: 'admin' },
        create: {
            username: 'admin',
            email: 'admin@pinbarter.org',
            passwordHash: adminHash,
            role: 'admin'
        }
    })
    console.log('Admin user ready:', admin.username)

    // MUPPETS CHRISTMAS CAROL
    const muppetsPins = [
        { name: 'Kermit the Frog', description: 'Kermit as Bob Cratchit in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Miss Piggy', description: 'Miss Piggy as Emily Cratchit in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Rizzo the Rat', description: 'Rizzo the Rat as narrator in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Gonzo', description: 'Gonzo as Charles Dickens in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Scrooge', description: 'Ebenezer Scrooge played by Michael Caine in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Ghost of Christmas Past', description: 'The Ghost of Christmas Past in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Ghost of Christmas Present', description: 'The jolly Ghost of Christmas Present in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
        { name: 'Ghost of Christmas Future', description: 'The mysterious Ghost of Christmas Future in a festive wreath', series: 'Muppets Christmas Carol', rarity: 'Limited Edition', editionSize: 3500, credits: 3 },
    ]

    // TOY STORY
    const toyStoryPins = [
        { name: 'Woody', description: 'Woody the cowboy celebrating Toy Story 30th Anniversary', series: 'Toy Story 30th Anniversary', rarity: 'Limited Edition', editionSize: 1965, credits: 5 },
        { name: 'Hamm', description: 'Hamm the piggy bank celebrating Toy Story 30th Anniversary', series: 'Toy Story 30th Anniversary', rarity: 'Limited Edition', editionSize: 1965, credits: 5 },
        { name: 'Rex', description: 'Rex the dinosaur celebrating Toy Story 30th Anniversary', series: 'Toy Story 30th Anniversary', rarity: 'Limited Edition', editionSize: 1965, credits: 5 },
        { name: 'Woody, Jessie & Buzz Star', description: 'Woody, Jessie and Buzz Lightyear together in a star shaped pin', series: 'Toy Story', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // DISNEY VILLAINS BLIND BAG
    const villainsPins = [
        { name: 'Jafar', description: 'Jafar the sorcerer from Aladdin in a frame', series: 'Disney Villains', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Cruella De Vil', description: 'Cruella De Vil from 101 Dalmatians in a frame', series: 'Disney Villains', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Maleficent', description: 'Maleficent from Sleeping Beauty in a frame', series: 'Disney Villains', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Ursula', description: 'Ursula the sea witch from The Little Mermaid in a frame', series: 'Disney Villains', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // PRINCESS AND THE FROG
    const princessFrogPins = [
        { name: 'Tiana', description: 'Tiana from The Princess and the Frog in a glittering oval frame', series: 'Princess and the Frog', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Mama Odie', description: 'Mama Odie the voodoo priestess from The Princess and the Frog', series: 'Princess and the Frog', rarity: 'Limited Edition', editionSize: 600, credits: 6 },
        { name: 'Dr Facilier', description: 'Dr Facilier the Shadow Man from The Princess and the Frog', series: 'Princess and the Frog', rarity: 'Limited Edition', editionSize: 600, credits: 6 },
    ]

    // WALT DISNEY WORLD PARKS
    const parkPins = [
        { name: 'Magic Kingdom', description: 'Magic Kingdom park icon pin featuring Cinderella Castle', series: 'Walt Disney World Parks', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Animal Kingdom', description: 'Animal Kingdom park icon pin featuring the Tree of Life', series: 'Walt Disney World Parks', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Hollywood Studios', description: 'Hollywood Studios park icon pin featuring the Hollywood Tower of Terror', series: 'Walt Disney World Parks', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Epcot', description: 'Epcot park icon pin featuring Spaceship Earth', series: 'Walt Disney World Parks', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // STAR WARS DROIDS
    const droidPins = [
        { name: 'BB-8', description: 'BB-8 style droid in blue', series: 'Star Wars Droids', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'R2-D2', description: 'R2-D2 style droid in orange', series: 'Star Wars Droids', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'BB-8 and D-O', description: 'BB-8 and D-O together from Star Wars The Rise of Skywalker', series: 'Star Wars Droids', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // THE MANDALORIAN
    const mandoPins = [
        { name: 'Grogu with Cup', description: 'Grogu sipping tea, from The Mandalorian', series: 'The Mandalorian', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Mando and Grogu', description: 'The Mandalorian and Grogu together', series: 'The Mandalorian', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // A GOOFY MOVIE
    const goofyPins = [
        { name: 'Max and Roxanne', description: 'Max and Roxanne from A Goofy Movie', series: 'A Goofy Movie', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Goofy and Max Fishing', description: 'Goofy and Max fishing from A Goofy Movie', series: 'A Goofy Movie', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Max as Powerline', description: 'Max dressed as Powerline from A Goofy Movie', series: 'A Goofy Movie', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // MICKEY AND FRIENDS
    const mickeyPins = [
        { name: 'French Mickey', description: 'Mickey Mouse in a French outfit at Disneyland Paris', series: 'Mickey and Friends Around the World', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'French Minnie', description: 'Minnie Mouse in a French outfit at Disneyland Paris', series: 'Mickey and Friends Around the World', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'US Mickey', description: 'Mickey Mouse in an American outfit at Walt Disney World', series: 'Mickey and Friends Around the World', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'US Minnie', description: 'Minnie Mouse in an American outfit at Walt Disney World', series: 'Mickey and Friends Around the World', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // RESTAURANT AND RIDE PINS
    const restaurantPins = [
        { name: "Walt's American Restaurant", description: "Pin commemorating Walt's American Restaurant at Disneyland Paris", series: 'Disney Dining', rarity: 'Limited Edition', editionSize: 5000, credits: 3 },
        { name: 'Fantasmic', description: 'Fantasmic nighttime spectacular show pin from Hollywood Studios', series: 'Disney Attractions', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: 'Space Mountain', description: 'Space Mountain classic attraction pin', series: 'Disney Attractions', rarity: 'Standard', editionSize: null, credits: 1 },
        { name: "Chef Mickey's", description: "Chef Mickey's restaurant pin featuring Mickey in chef's hat", series: 'Disney Dining', rarity: 'Standard', editionSize: null, credits: 1 },
    ]

    // Combine all pins
    const allPins = [
        ...muppetsPins,
        ...toyStoryPins,
        ...villainsPins,
        ...princessFrogPins,
        ...parkPins,
        ...droidPins,
        ...mandoPins,
        ...goofyPins,
        ...mickeyPins,
        ...restaurantPins,
    ]

    // Seed all pins
    for (const pin of allPins) {
        await prisma.pin.upsert({
            where: { name: pin.name },
            update: pin,
            create: { ...pin, isApproved: true }
        })
    }

    console.log(`${allPins.length} pins seeded successfully!`)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())