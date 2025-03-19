//Go to Completion progress /Overview of students and set all the students visible.
//Copy paste the following to the javascript console

//Select rows with 100%
var rivit = Array.from(document.querySelectorAll("tr")).filter(row => {
    const progressTD = row.querySelector("td.col-progress");
    return progressTD && progressTD.textContent.trim() === "100 %";
});
// Find student name for those rows (<td class="col-fullname"> and then <a>)
var raakanimet = rivit.map(rivi => {
    const nimiA = rivi.querySelector("td.col-fullname a");
    return nimiA ? nimiA.innerHTML : ''; //Palautetaan tyhjä jos ei löydy sopivaa elementtiä
});
// Clean up the span field and add grade for Peppi, should obviously incorporate grading for courses that grade 1-5 instead of pass/fail
var nimet = raakanimet.map(content => content.replace(/<[^>]*>.*?<\/[^>]*>|<[^>]*>/g, '').trim());
var peppinimet = nimet.map(nimi => {
    return `HYV/PASS;${nimi}`;
}).join('\n');
//Print to console for copypasting
console.log(peppinimet);
