//Currently for pass/fail graded Moodle activities
//Choose "Näytä kaikki palautukset" or "View all submissions"
//Activate Javascript console and copy paste the following (remember to allow popup windows)
//Insert namelist to popup window to mark everyone accepted. You need to press "Tallenna kaikki nopean arvioinnin muutokset"/"Save all quick grading changes"-button finally.

/**
 * Attempts to fix encoding mistakes when text comes from random sources and may contain botched characters
 * @param {string} text - the text to be fixed
 * @returns {string} - fixed text
 */
function fix_encoding(text) {
  //Non-exhaustive list of replacements, generated with AI and manually added some
  const replacements = {
        "Ã¤": "ä",
        "Ã…": "Å",
        "Ã„": "Ä",
        "Ã–": "Ö",
        "Ã¼": "ü",
        "Ãœ": "Ü",
        "Ã¶": "ö",
        "ÃŸ": "ß",
        "Ã¡": "á",
        "Ã©": "é",
        "Ã­": "í",
        "Ã³": "ó",
        "Ãº": "ú",
        "Ã±": "ñ",
        "Ã€": "À",
        "Ã‚": "Â",
        "Ãƒ": "Ã",
        "Ã‡": "Ç",
        "Ãˆ": "È",
        "Ã‰": "É",
        "ÃŠ": "Ê",
        "Ã‹": "Ë",
        "ÃŒ": "Ì",
        "Ã": "Í",
        "ÃŽ": "Î",
        "Ã": "Ï",
        "Ã": "Ð",
        "Ã‘": "Ñ",
        "Ã’": "Ò",
        "Ã“": "Ó",
        "Ã”": "Ô",
        "Ã•": "Õ",
        "Ã˜": "Ø",
        "Ãš": "Ú",
        "Ã›": "Û",
        "Ãœ": "Ü",
        "Ãž": "Þ",
        "Ãž": "þ",
        "ÃŸ": "ß",
        "Ã ": "à",
        "Ã¡": "á",
        "Ã¢": "â",
        "Ã£": "ã",
        "Ã¤": "ä",
        "Ã¥": "å",
        "Ã¦": "æ",
        "Ã§": "ç",
        "Ã¨": "è",
        "Ã©": "é",
        "Ãª": "ê",
        "Ã«": "ë",
        "Ã¬": "ì",
        "Ã­": "í",
        "Ã®": "î",
        "Ã¯": "ï",
        "Ã°": "ð",
        "Ã±": "ñ",
        "Ã²": "ò",
        "Ã³": "ó",
        "Ã´": "ô",
        "Ãµ": "õ",
        "Ã¶": "ö",
        "Ã¸": "ø",
        "Ã¹": "ù",
        "Ãº": "ú",
        "Ã»": "û",
        "Ã½": "ý",
        "Ã¾": "þ",
        "Ã¿": "ÿ",
        "Ã\u0084": "Ä",
        "Ã": "Ö",
        "Ã": "Å",

    };
    //Replace and return
    return text.replace(/Ã./g, match => replacements[match] || match);
}

/**
 * Normalise text for matching purposes
 * @param {string} text - the text to be normalised
 * @returns {string} - normalised text
 */
function remove_special_characters(input) {return input.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

/**
 * Function for handling a name list of students and marking those students as accepted in the Moodle quick grading
 * @param {string} namelist - the name list
 */
function approveStudents(namelist)
{
// Fix characters 
namelist = fix_encoding(namelist);
// Remove whitespaces, commas and tabulators, split by newline and map to nimi1 nimi2 pairs for handling:
namelist.replace(/[ \t,;]+/g, ' ').trim().split('\n').map(line => { const [nimi1, nimi2] = line.split(' ');    return { nimi1, nimi2 };}).forEach(({ nimi1, nimi2 }) => {
    // We don't care if it firstname lastname or vice versa. Let's make comparison constants:
    const nimi_1 = remove_special_characters(`${nimi1} ${nimi2}`.toLowerCase());
    const nimi_2 = remove_special_characters(`${nimi2} ${nimi1}`.toLowerCase());
    //Set up the display name:
    var nimi = `${nimi1} ${nimi2}`;

    // Find the right <a> tag:
    var anchor = Array.from(document.querySelectorAll('a')).find(a => remove_special_characters(a.textContent.toLowerCase()).includes(nimi_1))
    if (!anchor) {
      //Try different name order
      anchor = Array.from(document.querySelectorAll('a')).find(a => remove_special_characters(a.textContent.toLowerCase()).includes(nimi_2)); 
      nimi = `${nimi2} ${nimi1}`;
      }

    if (anchor) {
        // Find the parent TR
        const emoTR = anchor.closest('tr');
        if (emoTR) {
            // Find the TD with class "c7"
            const arviointiTD = emoTR.querySelector('td.c7');
            if (arviointiTD) {
            // Find the select 
                const select = arviointiTD.querySelector('select');
                if (select) {
                    // Find the <option> that says "hyväksytty"
                    const hyvOption = Array.from(select.options).find(option => option.text === "Hyväksytty");
                    if (hyvOption) {
                        // If accepted already, no action
												if (select.value == hyvOption.value) {console.log(`${nimi} on jo ok`);}
                        else {
                              //Otherwise approve
                              select.value = hyvOption.value;
                              console.log(`%cAsetettu ${nimi} hyväksytyksi!`, 'color: blue; font-size: 12px; font-weight: bold');
                              }
                    } else {
                        console.warn(`Oikeaa optiota ei löytynyt nimelle ${nimi}.`);
                    }
                } else {
                    console.warn(`TD:n sisältä ei löytynyt <select>-tagia nimelle ${nimi}.`);
                }
            } else {
                console.warn(`c7-luokalla varustettua <td>-tagia ei löytynyt nimelle ${nimi}.`);
            }
        } else {
            console.warn(`Nimelle ${nimi} ei löytynyt TR-tagia ylempää DOM:sta?`);
        }
    } else {
        console.warn(`Nimeä "${nimi}" ei löytynyt sivulta`);
    }
});
}

// Create a window for user input
    var nimilistaIkkuna = window.open('','_blank','width=600,height=500,top=100,left=100');

 //New window HTML content
    nimilistaIkkuna.document.write(`
        <html>
        <body>
            <h3>Syötä opiskelijoiden nimet, yksi per rivi:</h3>
            <textarea id="nimilista" rows="10" cols="40" style="width: 90%;"></textarea>
            <br>
            <button id="opiskelijatOk">Lähetä!</button>
            <script>
                document.getElementById('opiskelijatOk').onclick = function () {
                    window.opener.approveStudents(document.getElementById('nimilista').value);
                };
            </script>
        </body>
        </html>
    `);
