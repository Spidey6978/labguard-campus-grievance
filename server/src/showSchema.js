import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Asset from './models/Asset.js';
import Ticket from './models/Ticket.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/labguard';

function inspectSchema(modelName, model) {
  console.log(`\n============================================================`);
  console.log(`📦 COLLECTION: ${model.collection.name.toUpperCase()} (Model: ${modelName})`);
  console.log(`============================================================`);
  
  const paths = model.schema.paths;
  const table = [];

  for (const path in paths) {
    if (path === '__v') continue;
    const info = paths[path];
    const instance = info.instance;
    const isRequired = info.options?.required ? '✅ Yes' : 'No';
    const isUnique = info.options?.unique ? '⭐ Unique' : 'No';
    const ref = info.options?.ref ? `🔗 Ref(${info.options.ref})` : '-';
    const enums = info.options?.enum ? `[${info.options.enum.slice(0, 3).join(', ')}${info.options.enum.length > 3 ? '...' : ''}]` : '-';

    table.push({
      Field: path,
      Type: instance,
      Required: isRequired,
      Index: isUnique,
      Relation: ref,
      EnumOrConstraints: enums,
    });
  }

  console.table(table);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`\n✅ Connected to MongoDB: ${MONGO_URI}`);
    console.log(`🏛️ INSTITUTION: St. Francis Institute of Technology (SFIT) - INFT`);
    console.log(`🛠️ LABGUARD DATABASE SCHEMA INSPECTOR`);

    inspectSchema('User', User);
    inspectSchema('Asset', Asset);
    inspectSchema('Ticket', Ticket);

    console.log(`\n============================================================`);
    console.log(`📄 REAL MONGO DOCUMENT SAMPLES (findOne from live db):`);
    console.log(`============================================================\n`);

    const userSample = await User.findOne().lean();
    console.log(`🧑 Sample User Document:`);
    console.dir(userSample, { depth: null, colors: true });

    const assetSample = await Asset.findOne().lean();
    console.log(`\n🖥️ Sample Asset Document:`);
    console.dir(assetSample, { depth: null, colors: true });

    const ticketSample = await Ticket.findOne().lean();
    console.log(`\n🎫 Sample Ticket Document (with embedded timeline):`);
    console.dir(ticketSample, { depth: null, colors: true });

    process.exit(0);
  } catch (err) {
    console.error('Error reading schema:', err);
    process.exit(1);
  }
}

run();
