// utils/seeder.js – Seed the database with sample data
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const SparePart = require('../models/SparePart');
const Category = require('../models/Category');
const Inquiry = require('../models/Inquiry');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for seeding...');
};

// ─── Seed Data ───────────────────────────────────────────────────────────────

const users = [
    { name: 'Super Admin', email: 'admin@shanauto.lk', password: 'Admin@123', role: 'admin' },
    { name: 'Admin Manager', email: 'manager@shanauto.lk', password: 'Admin@123', role: 'admin' },
];

const categoryNames = [
    'Engine Parts', 'Suspension', 'Brakes', 'Electrical',
    'Body Parts', 'Cooling System', 'Transmission', 'Filters',
    'Exhaust System', 'Fuel System',
];

const vehicles = [
    { title: 'Toyota Aqua 2019 – Hybrid', brand: 'Toyota', model: 'Aqua', year: 2019, engineCapacity: '1500cc', transmission: 'CVT', fuelType: 'Hybrid', mileage: 45000, price: 5200000, description: 'Well-maintained Toyota Aqua with excellent fuel economy. Single owner, full service history. Pearl white colour.', status: 'available' },
    { title: 'Honda Vezel 2020 – RS', brand: 'Honda', model: 'Vezel', year: 2020, engineCapacity: '1500cc', transmission: 'CVT', fuelType: 'Hybrid', mileage: 32000, price: 7800000, description: 'Honda Vezel RS Hybrid in premium black. Factory navigation, push-start, reverse camera.', status: 'available' },
    { title: 'Suzuki Alto 2021', brand: 'Suzuki', model: 'Alto', year: 2021, engineCapacity: '660cc', transmission: 'Automatic', fuelType: 'Petrol', mileage: 18000, price: 2900000, description: 'Brand new condition Suzuki Alto. Ideal city car with superb mileage.', status: 'available' },
    { title: 'Nissan Leaf 2020 – EV', brand: 'Nissan', model: 'Leaf', year: 2020, engineCapacity: 'Electric', transmission: 'Automatic', fuelType: 'Electric', mileage: 28000, price: 6500000, description: '2020 Nissan Leaf 40kWh electric vehicle. 80% battery health. Zero emissions.', status: 'available' },
    { title: 'Toyota Prius 2018 – PHV', brand: 'Toyota', model: 'Prius', year: 2018, engineCapacity: '1800cc', transmission: 'CVT', fuelType: 'Hybrid', mileage: 67000, price: 6200000, description: 'Toyota Prius PHV plug-in hybrid. Panoramic roof, heated seats, full leather interior.', status: 'available' },
    { title: 'Honda Fit 2019 – GP6', brand: 'Honda', model: 'Fit', year: 2019, engineCapacity: '1300cc', transmission: 'CVT', fuelType: 'Hybrid', mileage: 41000, price: 4100000, description: 'Honda Fit hybrid with excellent fuel efficiency. Clean interior, no accidents.', status: 'available' },
    { title: 'Mazda Demio 2017', brand: 'Mazda', model: 'Demio', year: 2017, engineCapacity: '1300cc', transmission: 'Automatic', fuelType: 'Petrol', mileage: 82000, price: 3400000, description: 'Sporty Mazda Demio in red. Well serviced with new tyres.', status: 'available' },
    { title: 'Toyota Vitz 2018', brand: 'Toyota', model: 'Vitz', year: 2018, engineCapacity: '1000cc', transmission: 'Automatic', fuelType: 'Petrol', mileage: 54000, price: 3100000, description: 'Toyota Vitz in silver. Lightweight and economical. Great first car.', status: 'available' },
    { title: 'Mitsubishi Outlander PHEV 2019', brand: 'Mitsubishi', model: 'Outlander', year: 2019, engineCapacity: '2400cc', transmission: 'Automatic', fuelType: 'Hybrid', mileage: 38000, price: 9500000, description: 'Mitsubishi Outlander PHEV 4WD. 7-seater, twin-motor drive, tow bar.', status: 'available' },
    { title: 'Subaru XV 2020', brand: 'Subaru', model: 'XV', year: 2020, engineCapacity: '2000cc', transmission: 'CVT', fuelType: 'Petrol', mileage: 29000, price: 8100000, description: 'Subaru XV AWD in cool grey. Eyesight safety system, apple carplay.', status: 'available' },
    { title: 'Toyota Corolla Axio 2017', brand: 'Toyota', model: 'Corolla Axio', year: 2017, engineCapacity: '1500cc', transmission: 'CVT', fuelType: 'Hybrid', mileage: 73000, price: 4800000, description: 'Reliable Toyota Corolla Axio Hybrid. Spacious, comfortable, great for families.', status: 'available' },
    { title: 'Honda Grace 2018 – Hybrid', brand: 'Honda', model: 'Grace', year: 2018, engineCapacity: '1500cc', transmission: 'CVT', fuelType: 'Hybrid', mileage: 51000, price: 5600000, description: 'Elegant Honda Grace hybrid sedan. Full option, dual zone climate control.', status: 'available' },
    { title: 'Daihatsu Tanto 2020', brand: 'Daihatsu', model: 'Tanto', year: 2020, engineCapacity: '660cc', transmission: 'Automatic', fuelType: 'Petrol', mileage: 22000, price: 2600000, description: 'Spacious Daihatsu Tanto kei car. Sliding doors, tall roof, ideal for families.', status: 'reserved' },
    { title: 'Toyota Wish 2016', brand: 'Toyota', model: 'Wish', year: 2016, engineCapacity: '1800cc', transmission: 'Automatic', fuelType: 'Petrol', mileage: 91000, price: 4300000, description: '7-seater Toyota Wish. Third-row foldable seats, wood trim, sunroof.', status: 'available' },
    { title: 'Nissan Note 2019 – e-Power', brand: 'Nissan', model: 'Note', year: 2019, engineCapacity: '1200cc', transmission: 'Automatic', fuelType: 'Hybrid', mileage: 35000, price: 4700000, description: 'Nissan Note e-Power. Unique hybrid system – drives like an EV, charges like a hybrid.', status: 'sold' },
];

// Real catalogue photography. Hosted photos are used for seeded data; admin uploads
// continue to be served locally from /uploads.
const vehiclePhotos = [
    'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/193021/pexels-photo-193021.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/70912/pexels-photo-70912.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/714417/pexels-photo-714417.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1200',
];

const partPhotos = {
    'Engine Parts': 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=1200&q=85',
    Suspension: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?auto=format&fit=crop&w=1200&q=85',
    Brakes: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d9f?auto=format&fit=crop&w=1200&q=85',
    Electrical: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85',
    'Body Parts': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',
    'Cooling System': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1200&q=85',
    Transmission: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3e9?auto=format&fit=crop&w=1200&q=85',
    Filters: 'https://images.unsplash.com/photo-1635770311766-1a37d7a2e4d6?auto=format&fit=crop&w=1200&q=85',
    'Exhaust System': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=85',
    'Fuel System': 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&w=1200&q=85',
};

const inquiries = [
    { customerName: 'Kamal Perera', email: 'kamal@gmail.com', phone: '0711234567', chassisNumber: 'NHP10-1234567', message: 'I need front brake pads for this chassis. Please check compatibility.', status: 'pending' },
    { customerName: 'Nisha Silva', email: 'nisha@yahoo.com', phone: '0772345678', chassisNumber: 'ZE2-9876543', message: 'Looking for an AC compressor for my Honda Fit. Is it available?', status: 'reviewed' },
    { customerName: 'Ruwan Fernando', email: 'ruwan.f@outlook.com', phone: '0763456789', chassisNumber: 'GP5-5678901', message: 'Need IMA battery for Honda Insight hybrid. Urgent.', status: 'pending' },
    { customerName: 'Amali Dissanayake', email: 'amali@gmail.com', phone: '0704567890', chassisNumber: 'ZVW50-3210987', message: 'Require cabin air filter and engine oil filter for Prius 2016.', status: 'resolved' },
    { customerName: 'Pradeep Jayawardena', email: 'pradeep.j@gmail.com', phone: '0775678901', chassisNumber: 'GE6-6543210', message: 'Shock absorbers for Honda Fit 2013. Need all four.', status: 'pending' },
    { customerName: 'Sunethra Wickramasinghe', email: 'sunethra@gmail.com', phone: '0716789012', chassisNumber: 'DAA-GR8-0001234', message: 'Toyota Aqua 2015, looking for hybrid battery reconditioning or replacement.', status: 'pending' },
    { customerName: 'Chathura Gunaratne', email: 'chathura@hotmail.com', phone: '0757890123', chassisNumber: 'ZE8-1122334', message: 'Honda Vezel 2014 – need both front struts and strut mounts.', status: 'reviewed' },
    { customerName: 'Dilini Madushani', email: 'dilini.m@gmail.com', phone: '0728901234', chassisNumber: 'MK53S-456789', message: 'Suzuki Alto 2009 starter motor, does it fit my model?', status: 'pending' },
    { customerName: 'Isuru Bandara', email: 'isuru.b@gmail.com', phone: '0769012345', chassisNumber: 'GD1-9988776', message: 'Honda Fit 2002 radiator assembly. Complete unit needed.', status: 'resolved' },
    { customerName: 'Malika Rodrigo', email: 'malika.r@yahoo.com', phone: '0740123456', chassisNumber: 'AZE186-7654321', message: 'Toyota Corolla Axio 2016 – timing chain kit availability.', status: 'pending' },
];

// ─── Seeder Functions ─────────────────────────────────────────────────────────

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            Vehicle.deleteMany({}),
            SparePart.deleteMany({}),
            Category.deleteMany({}),
            Inquiry.deleteMany({}),
        ]);

        // Seed users (password hashing done by model pre-save hook)
        console.log('👤 Seeding users...');
        const createdUsers = await User.create(users);
        console.log(`   ✓ ${createdUsers.length} admin users created`);

        // Seed categories
        console.log('📂 Seeding categories...');
        const createdCategories = await Category.create(
            categoryNames.map((name) => ({ categoryName: name }))
        );
        console.log(`   ✓ ${createdCategories.length} categories created`);

        // Seed vehicles (without real images)
        console.log('🚗 Seeding vehicles...');
        const createdVehicles = await Vehicle.create(
            vehicles.map((vehicle, index) => ({ ...vehicle, images: [vehiclePhotos[index]] }))
        );
        console.log(`   ✓ ${createdVehicles.length} vehicles created`);

        // Build spare parts using created categories
        const catMap = {};
        createdCategories.forEach((c) => { catMap[c.categoryName] = c._id; });

        const spareParts = [
            { partName: 'Toyota Aqua Hybrid Battery', brand: 'Toyota', category: catMap['Electrical'], compatibleModels: ['Aqua NHP10', 'Aqua NHP10H'], stock: 5, price: 185000, description: 'Genuine remanufactured hybrid battery module for Toyota Aqua 2012-2021.' },
            { partName: 'Honda Fit GP5 IMA Battery', brand: 'Honda', category: catMap['Electrical'], compatibleModels: ['Fit GP5', 'Fit GP6'], stock: 3, price: 210000, description: 'High-capacity IMA battery for Honda Fit hybrid models.' },
            { partName: 'Toyota Prius ZVW50 Front Brake Pads Set', brand: 'Toyota', category: catMap['Brakes'], compatibleModels: ['Prius ZVW50', 'Prius ZVW51'], stock: 12, price: 14500, description: 'OEM-spec ceramic front brake pads for Prius 2016+.' },
            { partName: 'Honda Vezel RU3 Front Strut Assembly', brand: 'Honda', category: catMap['Suspension'], compatibleModels: ['Vezel RU3', 'Vezel RU4'], stock: 8, price: 38000, description: 'Complete front strut assembly (shock + spring + mount) for Honda Vezel.' },
            { partName: 'Suzuki Alto HA36 Air Filter', brand: 'Suzuki', category: catMap['Filters'], compatibleModels: ['Alto HA36S', 'Alto HA36V'], stock: 25, price: 1800, description: 'Engine air filter for Suzuki Alto 2014-2022.' },
            { partName: 'Nissan Leaf ZE0 Charger Port Assembly', brand: 'Nissan', category: catMap['Electrical'], compatibleModels: ['Leaf ZE0', 'Leaf AZE0'], stock: 4, price: 95000, description: 'OEM CHAdeMO charging port assembly for Nissan Leaf.' },
            { partName: 'Toyota Vitz KSP130 CV Boot Kit', brand: 'Toyota', category: catMap['Suspension'], compatibleModels: ['Vitz KSP130', 'Vitz NSP130'], stock: 15, price: 5500, description: 'CV axle gaiter boot kit for Toyota Vitz 2010-2019.' },
            { partName: 'Honda Grace GM4 Radiator', brand: 'Honda', category: catMap['Cooling System'], compatibleModels: ['Grace GM4', 'Grace GM5', 'Grace GM6'], stock: 6, price: 32000, description: 'Aluminium core radiator assembly for Honda Grace hybrid.' },
            { partName: 'Mazda Demio DJ5FS Timing Chain Kit', brand: 'Mazda', category: catMap['Engine Parts'], compatibleModels: ['Demio DJ5FS', 'Demio DJ3FS'], stock: 7, price: 28500, description: 'Full timing chain kit including tensioner and guides.' },
            { partName: 'Toyota Wish ZGE20 Rear Shock Absorbers (Pair)', brand: 'Toyota', category: catMap['Suspension'], compatibleModels: ['Wish ZGE20', 'Wish ZGE22', 'Wish ZGE25'], stock: 10, price: 22000, description: 'Pair of gas-filled rear shock absorbers for Toyota Wish 2009-2017.' },
            { partName: 'Subaru XV GP7 Rear Differential Fluid', brand: 'Subaru', category: catMap['Transmission'], compatibleModels: ['XV GP7', 'XV GT3', 'XV GT7'], stock: 30, price: 3200, description: 'Genuine Subaru rear differential gear oil – 75W90.' },
            { partName: 'Mitsubishi Outlander GG2W Front Brake Disc Rotor', brand: 'Mitsubishi', category: catMap['Brakes'], compatibleModels: ['Outlander GG2W', 'Outlander GG3W'], stock: 8, price: 18500, description: 'Ventilated front brake disc rotor for Outlander PHEV 2013+.' },
            { partName: 'Honda Fit GE6 Starter Motor', brand: 'Honda', category: catMap['Electrical'], compatibleModels: ['Fit GE6', 'Fit GE8', 'Fit GD1'], stock: 9, price: 16000, description: 'Remanufactured starter motor with 6-month warranty.' },
            { partName: 'Toyota Corolla Axio NZE141 Engine Oil Filter', brand: 'Toyota', category: catMap['Filters'], compatibleModels: ['Corolla Axio NZE141', 'Corolla Axio NZE144'], stock: 40, price: 850, description: 'Genuine Toyota engine oil filter – fits 1NZ-FE engine.' },
            { partName: 'Nissan Note E12 Camshaft Position Sensor', brand: 'Nissan', category: catMap['Engine Parts'], compatibleModels: ['Note E12', 'Note HE12'], stock: 11, price: 9500, description: 'OEM camshaft position sensor for Nissan Note 2012+.' },
            { partName: 'Toyota Aqua NHP10 Front Bumper', brand: 'Toyota', category: catMap['Body Parts'], compatibleModels: ['Aqua NHP10'], stock: 3, price: 45000, description: 'OEM-spec front bumper for Toyota Aqua NHP10 2012-2017 facelift.' },
            { partName: 'Honda Vezel RU1 Cabin Air Filter', brand: 'Honda', category: catMap['Filters'], compatibleModels: ['Vezel RU1', 'Vezel RU2', 'Vezel RU3', 'Vezel RU4'], stock: 22, price: 2200, description: 'Activated carbon cabin pollen filter for Honda Vezel all variants.' },
            { partName: 'Toyota Prius Alpha ZVW40 Exhaust Muffler', brand: 'Toyota', category: catMap['Exhaust System'], compatibleModels: ['Prius Alpha ZVW40', 'Prius Alpha ZVW41'], stock: 5, price: 38000, description: 'Rear muffler silencer section for Prius Alpha/V wagons.' },
            { partName: 'Suzuki Alto HA36 Fuel Injector', brand: 'Suzuki', category: catMap['Fuel System'], compatibleModels: ['Alto HA36S', 'Alto Works HA36S'], stock: 14, price: 12500, description: 'OEM-spec fuel injector for 660cc R06A engine.' },
            { partName: 'Honda Fit GP5 Rear Drum Brake Shoes', brand: 'Honda', category: catMap['Brakes'], compatibleModels: ['Fit GP5', 'Fit GK3', 'Fit GK5'], stock: 18, price: 7500, description: 'Rear drum brake shoes set for Honda Fit 2013-2020.' },
            { partName: 'Daihatsu Tanto LA600S CV Axle Shaft', brand: 'Daihatsu', category: catMap['Suspension'], compatibleModels: ['Tanto LA600S', 'Tanto LA610S'], stock: 6, price: 28000, description: 'Right-side front drive shaft for Daihatsu Tanto 2013+.' },
            { partName: 'Toyota Vitz NSP130 Alternator', brand: 'Toyota', category: catMap['Electrical'], compatibleModels: ['Vitz NSP130', 'Vitz NCP131'], stock: 7, price: 32000, description: 'Remanufactured alternator 80A for Toyota Vitz 2010-2019.' },
            { partName: 'Subaru XV GT3 Engine Air Filter', brand: 'Subaru', category: catMap['Filters'], compatibleModels: ['XV GT3', 'XV GT7', 'Impreza GP'], stock: 16, price: 4200, description: 'High-flow engine air filter for 2017+ Subaru XV FB20 engine.' },
            { partName: 'Nissan Leaf AZE0 Rear Brake Pads', brand: 'Nissan', category: catMap['Brakes'], compatibleModels: ['Leaf AZE0', 'Leaf ZE1'], stock: 10, price: 11000, description: 'Ceramic rear brake pad set for 2018+ Nissan Leaf 40kWh.' },
            { partName: 'Toyota Wish ZGE20 Fuel Pump Assembly', brand: 'Toyota', category: catMap['Fuel System'], compatibleModels: ['Wish ZGE20', 'Wish ZGE22'], stock: 5, price: 22000, description: 'Complete in-tank fuel pump assembly with strainer for Toyota Wish.' },
            { partName: 'Honda Grace GM6 Thermostat', brand: 'Honda', category: catMap['Cooling System'], compatibleModels: ['Grace GM6', 'Grace GM9', 'Jade FR5'], stock: 12, price: 5800, description: 'Coolant thermostat with housing for Honda LEB hybrid engine.' },
            { partName: 'Mitsubishi Outlander PHEV GG2W Rear Caliper', brand: 'Mitsubishi', category: catMap['Brakes'], compatibleModels: ['Outlander GG2W', 'Outlander GG3W', 'ASX GA6W'], stock: 4, price: 42000, description: 'Remanufactured rear brake caliper – right side.' },
            { partName: 'Mazda Demio DJ3FS Taillight Assembly', brand: 'Mazda', category: catMap['Body Parts'], compatibleModels: ['Demio DJ3FS', 'Demio DJ5FS', 'Demio DJ5AS'], stock: 5, price: 24500, description: 'LED taillight assembly left side for Mazda Demio 4th gen 2014+.' },
            { partName: 'Toyota Corolla NZE141 Water Pump', brand: 'Toyota', category: catMap['Cooling System'], compatibleModels: ['Corolla NZE141', 'Vitz NCP91', 'Yaris NCP91'], stock: 9, price: 14500, description: 'OEM-spec water pump for 1NZ-FE and 1KR-FE engines.' },
            { partName: 'Nissan Note E12 Clutch Fan Belt Kit', brand: 'Nissan', category: catMap['Engine Parts'], compatibleModels: ['Note E12 1.2', 'March K13', 'Micra K13'], stock: 20, price: 6200, description: 'Complete serpentine belt and tensioner kit for HR12DE engine.' },
        ];

        console.log('🔧 Seeding spare parts...');
        const categoryById = Object.fromEntries(createdCategories.map((c) => [String(c._id), c.categoryName]));
        const createdParts = await SparePart.create(
            spareParts.map((part) => ({ ...part, image: partPhotos[categoryById[String(part.category)]] }))
        );
        console.log(`   ✓ ${createdParts.length} spare parts created`);

        // Seed inquiries
        console.log('📩 Seeding inquiries...');
        const createdInquiries = await Inquiry.create(inquiries);
        console.log(`   ✓ ${createdInquiries.length} inquiries created`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('───────────────────────────────────────');
        console.log('Admin credentials:');
        console.log('  Email   : admin@shanauto.lk');
        console.log('  Password: Admin@123');
        console.log('───────────────────────────────────────');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
