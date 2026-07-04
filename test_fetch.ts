import axios from "axios";

// Lista oficial rápida para comparar slugs
const OFFICIAL_SLUGS = [
  "onodi-floripa", "ribeiro-copeiro-84-f-c", "montinho-artilheiro-f-c", "sovaco-da-pantera",
  "real-barreiros-fc", "fortaleza-da-ilha", "palmeiras-m-g-c", "abedaozinho", "abedao",
  "cavernoso-meia-boca", "glorioso-f-c-v8", "tapa-f-c", "sc-manchester-curitiba",
  "ec-pato-branco", "marreco-da-peste", "tuiuti-esporte-clube", "cruzeiro-do-sul-fc",
  "futcafa", "ec-pinheiros-sul", "leao-da-fronteira", "avahy-costa-da-lagoa", "atletico-paranaense-f-c",
  "coritiba-f-c-paranana", "uniao-da-ilha-fc", "operario-ferroviario-f-c"
];

async function runTestAndAnalyze() {
  const url = "https://docs.google.com/spreadsheets/d/1wGw0eOvoqS-Iv_qSqzpRBSPA815SqHFiEu2TMk0O_Lk/export?format=csv";
  try {
    const res = await axios.get(url, { timeout: 10000 });
    const text = res.data;
    
    // Parse básico de CSV
    const rows: string[][] = [];
    let row: string[] = [];
    let entry = "";
    let insideQuote = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          entry += '"';
          i++;
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = "";
      } else if ((char === '\n' || char === '\r') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') i++;
        row.push(entry.trim());
        rows.push(row);
        row = [];
        entry = "";
      } else {
        entry += char;
      }
    }
    if (row.length > 0 || entry !== "") {
      row.push(entry.trim());
      rows.push(row);
    }

    console.log("Número de linhas parseadas:", rows.length);
    console.log("Cabeçalho Linha 0 (Rounds):", rows[0].slice(0, 10));
    console.log("Cabeçalho Linha 1 (Pontos/Patr):", rows[1].slice(0, 10));

    // Agora vamos ver quais slugs estão na planilha que batem ou não com nossos slugs oficiais
    const foundSlugs: string[] = [];
    const missingSlugs: string[] = [];
    
    for (let r = 2; r < rows.length; r++) {
      const slugRaw = rows[r][0];
      if (!slugRaw) continue;
      foundSlugs.push(slugRaw);
    }

    console.log("Slugs encontrados na planilha:", foundSlugs.join(", "));
    console.log("Quantidade de Slugs da Planilha:", foundSlugs.length);
    
    const unmatchedOff = OFFICIAL_SLUGS.filter(s => !foundSlugs.includes(s));
    const unmatchedSheet = foundSlugs.filter(s => !OFFICIAL_SLUGS.includes(s));
    
    console.log("Slugs Oficiais que NÃO estão na planilha:", unmatchedOff);
    console.log("Slugs da Planilha que NÃO estão na lista Oficial:", unmatchedSheet);

    // Vamos testar se conseguimos parsear a rodada 18 do abedao
    const abedaoRow = rows.find(r => r[0] === "abedao");
    if (abedaoRow) {
      console.log("\nAmostras de dados do 'abedao':");
      for (let r = 1; r <= 18; r++) {
        const scoreCol = (r - 1) * 2 + 1;
        const patrCol = (r - 1) * 2 + 2;
        console.log(`R${r}: Pontuação: ${abedaoRow[scoreCol]}, Patrimonio: ${abedaoRow[patrCol]}`);
      }
    }
  } catch (err: any) {
    console.error("ERRO NO FETCH:", err.message);
  }
}

runTestAndAnalyze();


