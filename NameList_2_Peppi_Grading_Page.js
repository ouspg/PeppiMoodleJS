//Open Peppi and the course grading page (note by default only shows 100 students, might need to increase size of view)
//Paste the following to JS console:
//Note popup windows need to be enabled

/**
 * Grade and trigger grading action
 * @param {string} arvostelulista - The list of names and grades
 */

function arvosteleOpiskelijat(arvostelulista)
{
console.log("Käsitellään opiskelijat arvosanoineen:");
arvostelulista.trim().split('\n').forEach(rivi => {
    // Nimi ja arvosana
    const [ARVOSANA, NIMI] = rivi.split(';');

    // Etsitään opiskelija
    const opiskelija = document.querySelector(`tr[data-student-name="${NIMI}"]`);

    if (!opiskelija) {
        console.warn(`Opiskelijaa ${NIMI} ei löydy!`);
        return;
    }

    //Etsitään arvostelusarake
    const arvosanasarake = opiskelija.querySelector('td.grade');

    if (!arvosanasarake) {
        console.warn(`Ei arvosanasaraketta opiskelijalle ${NIMI}`);
        return; 
    }

    // Arvosanalomake
    const selectArvosana = arvosanasarake.querySelector('select');
    if (!selectArvosana) {
        console.warn(`Ei select-elementtiä opiskelijalle ${NIMI}`);
        return;
    }

     //Nykyinen arvosana?
    const arvosanaNYT = selectArvosana.value;
    // Halutun arvosanan arvo (value -attribuutti)
    const arvosanaUUSI = Array.from(selectArvosana.options).find(option => option.innerHTML.trim() === ARVOSANA);

    if (!arvosanaUUSI) {
        console.warn(`Arvosanaa ${ARVOSANA} opiskelijalle ${NIMI} ei löydy!`);
        return;
    }

    // Jos ei arvosanaa aiemmin, valitaan uusi
    if (arvosanaNYT == "NULL") {
        selectArvosana.value = arvosanaUUSI.value;
        selectArvosana.dispatchEvent(new Event('change')); //Laukaistaan muutos peppiin
        console.log(`Opiskelijalle ${NIMI} annettu nyt arvosana ${ARVOSANA}.`);
    } else {
        if (arvosanaNYT === arvosanaUUSI.value) {
        console.log(`Ohitetaan ${NIMI} - syötetty jo`);
    } else {
        console.warn(`Opiskelijalla ${NIMI} on tällä hetkellä eri arvosana kuin ${ARVOSANA}. Tarkista!`);
    }}
});
}

// Luodaan uusi ikkuna

    var nimilistaIkkuna = window.open('','_blank','width=600,height=500,top=100,left=100');

 //Tehdään ikkunaan tarvittava HTML-sisältö opiskelijalistan sisäänottamiselle

    nimilistaIkkuna.document.write(`

        <html>
        <body>
            <h3>Syötä opiskelijoiden nimet, yksi per rivi:</h3>
            <textarea id="nimilista" rows="10" cols="40" style="width: 90%;"></textarea>
            <br>
            <button id="opiskelijatOk">Lähetä!</button>
            <script>
                document.getElementById('opiskelijatOk').onclick = function () {
                    window.opener.arvosteleOpiskelijat(document.getElementById('nimilista').value);
                };
            </script>
        </body>
        </html>
    `);
