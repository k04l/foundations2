import mongoose from 'mongoose';
import Deck from '../models/deck.js';
import FlashCard from '../models/flashCard.js';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const config = {
  uri: process.env.MONGODB_URI, // Changed from MONGO_URI to MONGODB_URI
  options: {
    // You can add more options here if needed
  }
};

// Sample data
const decksData = [
  {
    title: 'HVAC Fundamentals',
    description: 'Basic concepts and principles of heating, ventilation, and air conditioning',
    category: 'fundamentals',
    icon: '🌡️',
    difficulty: 'beginner'
  },
  {
    title: 'Psychrometrics',
    description: 'Study of thermodynamic properties of moist air',
    category: 'fundamentals',
    icon: '💧',
    difficulty: 'intermediate'
  },
  {
    title: 'Load Calculations',
    description: 'Methods for calculating heating and cooling loads',
    category: 'calculations',
    icon: '🔢',
    difficulty: 'advanced'
  },
  {
    title: 'ASHRAE Standards',
    description: 'Key ASHRAE standards and guidelines for HVAC design',
    category: 'codes-standards',
    icon: '📋',
    difficulty: 'intermediate'
  },
  {
    title: 'Chiller Systems',
    description: 'Components and operation of chilled water systems',
    category: 'equipment',
    icon: '❄️',
    difficulty: 'advanced'
  },
  {
    title: 'PE Test Prep',
    description: 'Practice questions for the Professional Engineer (PE) Mechanical exam',
    category: 'fundamentals',
    icon: '📝',
    difficulty: 'advanced'
  },
  {
    title: 'Hydronics 101',
    description: 'Introduction to hydronic heating and cooling systems',
    category: 'hvac-systems',
    icon: '💧',
    difficulty: 'beginner'
  },
  {
    title: 'Data Center Design',
    description: 'Key concepts for HVAC and MEP design in mission-critical data centers',
    category: 'equipment',
    icon: '🖥️',
    difficulty: 'intermediate'
  }
];

const cardsData = {
  'HVAC Fundamentals': [
    {
      question: 'What does HVAC stand for?',
      answer: 'Heating, Ventilation, and Air Conditioning',
      explanation: 'HVAC refers to the technology of indoor and vehicular environmental comfort.',
      difficulty: 'beginner',
      tags: ['basics', 'terminology']
    },
    {
      question: 'What is the primary purpose of ventilation in HVAC systems?',
      answer: 'To provide fresh air and remove contaminants from indoor spaces',
      explanation: 'Ventilation helps maintain indoor air quality by diluting pollutants and providing oxygen.',
      difficulty: 'beginner',
      tags: ['ventilation', 'air quality']
    },
    {
      question: 'What is a BTU?',
      answer: 'British Thermal Unit - the amount of heat required to raise the temperature of one pound of water by one degree Fahrenheit',
      difficulty: 'beginner',
      tags: ['units', 'heat']
    }
  ],
  'Psychrometrics': [
    {
      question: 'What is relative humidity?',
      answer: 'The ratio of the current amount of water vapor in the air to the maximum amount of water vapor the air can hold at that temperature',
      explanation: 'Expressed as a percentage, relative humidity indicates how close the air is to saturation.',
      difficulty: 'intermediate',
      tags: ['humidity', 'air properties']
    },
    {
      question: 'What is the dew point temperature?',
      answer: 'The temperature at which air becomes saturated and water vapor begins to condense',
      explanation: 'When air is cooled to its dew point, relative humidity reaches 100%.',
      difficulty: 'intermediate',
      tags: ['temperature', 'condensation']
    }
  ],
  'Load Calculations': [
    {
      question: 'What are the main components of cooling load?',
      answer: 'Solar heat gain, internal heat gains (people, lights, equipment), and envelope heat transfer',
      explanation: 'Cooling load calculations must account for all sources of heat entering the space.',
      difficulty: 'advanced',
      tags: ['cooling', 'heat gain']
    },
    {
      question: 'What is the difference between sensible and latent heat?',
      answer: 'Sensible heat changes temperature without changing state; latent heat changes state without changing temperature',
      explanation: 'In HVAC, sensible cooling reduces air temperature, while latent cooling removes moisture.',
      difficulty: 'intermediate',
      tags: ['thermodynamics', 'heat transfer']
    }
  ],
  'PE Test Prep': [
    {
      question: 'What is the minimum outside air ventilation rate for office spaces per ASHRAE 62.1?',
      answer: '5 cfm per person',
      explanation: 'ASHRAE Standard 62.1 specifies minimum ventilation rates for various occupancy types.',
      difficulty: 'advanced',
      tags: ['ASHRAE', 'ventilation', 'codes']
    },
    {
      question: 'What is the typical passing score for the PE Mechanical exam?',
      answer: 'Varies by year, but typically around 70%',
      explanation: 'NCEES does not publish exact passing scores, but it is generally in the 65-75% range.',
      difficulty: 'advanced',
      tags: ['exam', 'PE', 'test prep']
    }
  ],
  'Hydronics 101': [
    {
      question: 'What is a hydronic system?',
      answer: 'A heating or cooling system that uses water as the heat transfer medium',
      explanation: 'Hydronic systems circulate water through pipes to radiators, coils, or underfloor tubing.',
      difficulty: 'beginner',
      tags: ['hydronics', 'basics']
    },
    {
      question: 'What is the main advantage of using water for heat transfer in HVAC?',
      answer: 'Water has a high specific heat capacity, making it efficient for transporting thermal energy',
      difficulty: 'beginner',
      tags: ['hydronics', 'heat transfer']
    }
  ],
  'Data Center Design': [
    {
      question: 'What is the primary cooling challenge in data centers?',
      answer: 'Managing high heat loads from densely packed IT equipment',
      explanation: 'Data centers require robust cooling to maintain equipment reliability and uptime.',
      difficulty: 'intermediate',
      tags: ['data center', 'cooling', 'design']
    },
    {
      question: 'What is hot aisle/cold aisle containment?',
      answer: 'A layout strategy to separate hot and cold air streams, improving cooling efficiency',
      explanation: 'Containment systems prevent mixing of hot and cold air, reducing energy use.',
      difficulty: 'intermediate',
      tags: ['containment', 'airflow', 'data center']
    }
  ]
};

async function seedDatabase() {
  try {
    // Connect to database
    await mongoose.connect(config.uri, config.options);
    console.log('Connected to database');

    // Clear existing data
    await Deck.deleteMany({});
    await FlashCard.deleteMany({});
    console.log('Cleared existing data');

    // Create decks
    const createdDecks = await Deck.create(decksData);
    console.log(`Created ${createdDecks.length} decks`);

    // Create cards for each deck
    let totalCards = 0;
    for (const deck of createdDecks) {
      const cards = cardsData[deck.title] || [];
      
      for (const cardData of cards) {
        await FlashCard.create({
          ...cardData,
          deck: deck._id
        });
        totalCards++;
      }
      
      // Update deck card count
      await deck.updateCardCount();
    }
    
    console.log(`Created ${totalCards} flash cards`);
    console.log('Seeding completed successfully');
    
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the seeder
seedDatabase();

export default seedDatabase;
