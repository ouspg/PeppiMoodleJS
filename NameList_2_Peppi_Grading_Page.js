//Open Peppi and the course grading page (note by default only shows 100 students, might need to increase size of view)
//Paste the following to JS console:
//Note popup windows need to be enabled

{
/**
 * AsyncLock
 * Locking to control throttling of Peppi calls
 * AI-generated code
 */

class AsyncLock {
  constructor() {
    this._lock = Promise.resolve();  // initially resolved
  }

  // This method returns a promise that resolves once the lock is available
  async get() {
    let unlockNext;
    const willLock = new Promise(resolve => {
      unlockNext = resolve; // save the resolve function to unlock later
    });

    // Create a promise chain to ensure that each `get` waits for the previous one
    const willUnlock = this._lock.then(() => unlockNext);

    // Update the lock to the new lock, preventing other calls from executing
    this._lock = willLock;

    return willUnlock;
  }

  // Method to release the lock
  release() {
    this._lock.resolve();  // resolving the lock allows the next operation to proceed
  }
}

var peppiLukko = new AsyncLock();
    
/**
 * waitForPeppi
 * Wait until a specific attribute is set. Edited, based on AI given code
 * @param {DOM object} element which element to wait for - student tr probably
 * @param {string} attributeName which attribute to wait for - data-accomplishment-id probably
 */

function waitForPeppi(element, attributeName) {
    const timeoutMs = 5000;
    const pollInterval = 50;
    
    return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      const attr = element.getAttribute(attributeName);
      if (attr && attr.trim() !== "") {
        resolve(attr);
      } else if (Date.now() - start >= timeoutMs) {
        resolve(null);  // or reject if preferred
      } else {
        setTimeout(check, pollInterval);
      }
    };
    check();
  });
}

/**
 * Grade student respecting Peppi throttling
 * @param {DOM object} opiskelija
 * @param {DOM object} arvosana
 * @param {string} uusiarvosana
 */

async function arvosteleOpiskelija(opiskelija,arvosana,uusiarvosana,uusiarvosanaValue)
    {
        const avaa = await peppiLukko.get();
        arvosana.value = uusiarvosanaValue;
        arvosana.dispatchEvent(new Event('change')); //Laukaistaan muutos peppiin
        await waitForPeppi(opiskelija,"data-accomplishment-id"); //Ilman kunnon odotusta sivu ei toimi...
        console.log(`%cOpiskelijalle ${opiskelija.dataset.studentName} annettu nyt arvosana ${uusiarvosana}!`, 'color: blue; font-size: 12px; font-weight: bold');
        avaa();
    }


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
    //console.log(opiskelija.dataset.accomplishmentId);
    // Jos ei arvosanaa aiemmin, valitaan uusi
    if (arvosanaNYT == "NULL") {
        arvosteleOpiskelija(opiskelija,selectArvosana,ARVOSANA,arvosanaUUSI.value)
    } else {
        if (arvosanaNYT === arvosanaUUSI.value) {
        console.log(`Ohitetaan ${NIMI} - syötetty jo`);
    } else {
        console.warn(`Opiskelijalla ${NIMI} on tällä hetkellä eri arvosana kuin ${ARVOSANA}. Tarkista!`);
    }
    }
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
}
