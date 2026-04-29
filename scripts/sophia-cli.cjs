#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const command = process.argv[2] || 'help';

const commands = {
  help: showHelp,
  check: runCheck,
  models: listModels,
  ask: askLocalModel,
  ideas: generateLocalIdeas,
  smoke: runSmoke,
  status: showStatus,
};

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}

commands[command]();

function showHelp() {
  console.log(`Sophia CLI

Usage:
  npm run sophia -- <command>

Commands:
  check   Run full Sophia smoke and syntax checks
  models  List local Ollama models
  ask     Ask a local Ollama model: npm run sophia -- ask "prompt"
  ideas   Generate practical everyday app ideas (local, optional topic)
  smoke   Run local link/asset smoke tests
  status  Print local project readiness signals
  help    Show this help
`);
}

function runCheck() {
  run('bash', ['plugins/sophia-operator/scripts/sophia-check.sh']);
}

function runSmoke() {
  run('npm', ['run', 'smoke']);
}

function listModels() {
  run('ollama', ['list']);
}

function askLocalModel() {
  const prompt = process.argv.slice(3).join(' ').trim();
  if (!prompt) {
    console.error('Usage: npm run sophia -- ask "your prompt"');
    process.exit(1);
  }

  const model = process.env.SOPHIA_OLLAMA_MODEL || 'qwen2.5:3b';
  run('ollama', ['run', model, prompt]);
}

function generateLocalIdeas() {
  const topic = process.argv.slice(3).join(' ').trim().toLowerCase();
  const catalog = [
    { title: 'Meal Leftover Spinner', category: 'home', effort: 'micro', problem: 'People waste food because leftovers are forgotten.', mvp: 'Ingredient input, recipe suggestions, favorite list.' },
    { title: 'Bill Deadline Radar', category: 'money', effort: 'small', problem: 'Late fees happen when bill dates are scattered.', mvp: 'Due-date board, status toggle, reminder windows.' },
    { title: 'Reading Streak Buddy', category: 'family', effort: 'small', problem: 'Families want consistent reading habits.', mvp: 'Daily log, streak tracker, weekly report.' },
    { title: 'Errand Route Planner', category: 'home', effort: 'medium', problem: 'Errands waste time when stops are ungrouped.', mvp: 'Stop list, neighborhood grouping, done states.' },
    { title: 'Meeting Prep Card', category: 'productivity', effort: 'micro', problem: 'Meetings lack clear goals and follow-up.', mvp: 'Agenda template, decision list, action capture.' },
    { title: 'Subscription Audit', category: 'money', effort: 'small', problem: 'Recurring charges are hidden across services.', mvp: 'Subscription register, monthly total, cancel checklist.' },
    { title: 'Walking Goal Splitter', category: 'health', effort: 'micro', problem: 'Step goals feel too large to execute daily.', mvp: 'Goal splitter, checkpoint tracker, completion streak.' },
    { title: 'Home Maintenance Pulse', category: 'home', effort: 'small', problem: 'Maintenance tasks are missed until breakage.', mvp: 'Task templates, due dates, completion log.' },
    { title: 'Trip Document Pack', category: 'travel', effort: 'small', problem: 'Travelers forget key documents.', mvp: 'Template checklist by trip type, done tracker.' },
    { title: 'School Bag Reset', category: 'family', effort: 'micro', problem: 'Morning rush causes missed school items.', mvp: 'Night-before checklist per child and weekday presets.' },
    { title: 'Focus Sprint Planner', category: 'productivity', effort: 'micro', problem: 'People struggle to plan realistic focus blocks.', mvp: 'Available time input, generated sprint plan, break hints.' },
    { title: 'Pharmacy Refill Log', category: 'health', effort: 'medium', problem: 'Refill timing is hard to track manually.', mvp: 'Medication cards, refill projection, pickup notes.' },
  ];

  const words = topic.split(/\s+/).filter(Boolean);
  const scored = catalog
    .map((idea) => {
      const text = `${idea.title} ${idea.category} ${idea.problem} ${idea.mvp}`.toLowerCase();
      const score = words.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
      return { ...idea, score };
    })
    .sort((a, b) => b.score - a.score || effortRank(a.effort) - effortRank(b.effort) || a.title.localeCompare(b.title));

  const picks = (words.length ? scored.filter((x) => x.score > 0) : scored).slice(0, 8);
  if (!picks.length) {
    console.log('No close matches for that topic. Try a broader phrase (e.g. "family", "money", "travel").');
    process.exit(0);
  }

  console.log(`\nSophia local everyday app ideas${topic ? ` for "${topic}"` : ''}\n`);
  picks.forEach((idea, index) => {
    console.log(`${index + 1}. ${idea.title} [${idea.category} · ${idea.effort}]`);
    console.log(`   Problem: ${idea.problem}`);
    console.log(`   MVP: ${idea.mvp}`);
  });

  if (process.env.SOPHIA_IDEA_WITH_OLLAMA === '1') {
    const model = process.env.SOPHIA_OLLAMA_MODEL || 'qwen2.5:3b';
    console.log(`\nOptional Ollama expansion (model ${model}):`);
    console.log(`npm run sophia -- ask "Use these as seed ideas: ${picks.map((x) => x.title).join(', ')}. Return 5 more practical everyday mini-apps with MVP steps."`);
  }
}

function effortRank(effort) {
  return ({ micro: 1, small: 2, medium: 3 }[effort] || 9);
}

function showStatus() {
  const requiredFiles = [
    'control-center.html',
    'future.css',
    'future.js',
    'translator.js',
    'social.html',
    'everyday-tools.html',
    'natural-cures.html',
    'config.js',
    'api/health.js',
    'api/translate.js',
    'api/webhook.js',
    'scripts/smoke-test.cjs',
  ];

  console.log('Sophia local status');
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(root, file));
    console.log(`${exists ? 'ok ' : 'miss'} ${file}`);
  }

  console.log('\nProduction env signals');
  for (const name of [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_PRICE_TIER_MAP',
  ]) {
    console.log(`${process.env[name] ? 'set ' : 'need'} ${name}`);
  }
}

function run(bin, args) {
  const result = spawnSync(bin, args, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }

  process.exit(result.status ?? 1);
}
