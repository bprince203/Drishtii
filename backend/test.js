try { new (require('@prisma/client').PrismaClient)({}); console.log('success'); } catch(e) { console.log(e.message); }
