const base=(process.argv[2]??'http://127.0.0.1:8787').replace(/\/$/,'');
const journeys=[
  {name:'researcher finds full-text reviews',path:'/en/library?kind=paper&depth=full-text',must:['20 found','Full text']},
  {name:'professional finds identity honeytokens',path:'/en/library?technique=Honeytoken&environment=Identity',must:['Results','Honeytoken']},
  {name:'Spanish reader opens critical readings',path:'/es/library?critical=1',must:['50 encontrados','Lectura crítica']},
  {name:'reader audits coverage',path:'/en/coverage',must:['187 source-linked records','20','Full catalog check']},
  {name:'researcher exports one citation',path:'/api/citation/honeywords-2013?format=ris',must:['TY  - JOUR','Honeywords','ER  -']},
];
const results=[];
for(const journey of journeys){
  const response=await fetch(base+journey.path,{redirect:'follow'});
  const body=await response.text();
  const missing=journey.must.filter(value=>!body.includes(value));
  results.push({name:journey.name,status:response.status,passed:response.ok&&!missing.length,missing});
}
console.log(JSON.stringify({base,results},null,2));
if(results.some(result=>!result.passed))process.exit(1);
