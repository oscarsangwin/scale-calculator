function getScale(note, key) {
    // Returns an array of the notes in a scale
    // * Assumes valid input

    function mod(n, m) {
        return ((n % m) + m) % m;
    };

    const notes = [
        ['C'],
        ['C#', 'Db'],
        ['D'],
        ['D#', 'Eb'],
        ['E'],
        ['F'],
        ['F#', 'Gb'],
        ['G'],
        ['G#', 'Ab'],
        ['A'],
        ['A#', 'Bb'],
        ['B']
    ];
    const naturals = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    // Key formula to number of semitones (e.g whole tone = 2 semitones)
    const majFomula = [2, 2, 1, 2, 2, 2, 1];
    const minFormula = [2, 1, 2, 2, 1, 2, 2];

    function getNoteIndex(note) {
        // Get the index of a note in the notes array
        for (const [i, n] of notes.entries()) { // Same as python 3 enumerate
            if (n.includes(note)) {
                return i;
            };
        };

        // Return -1 if note not found
        return -1;
    };

    function shiftBySemitones(note, semitones, accidental='#') {
        // Shifts a note up or down by a number of semitones

        let pos = getNoteIndex(note);
        pos = (pos + semitones) % notes.length
        ret = notes[pos]

        if (ret.length === 1 || accidental === '#') {
            // Return the natural note or first element if accidental is a sharp
            return ret[0];
        } else {
            // Accidental is a flat
            return ret[1];
        };
    };

    // --- Work out the notes in the scale ---
    
    // Get formula from the key
    let formula;
    if (key === 'Maj') {
        formula = majFomula;
    } else {
        formula = minFormula;
    };

    // Set accidental
    let accidental;
    if (note.length === 2 && note[1] === 'b') {
        accidental = 'b';
    } else {
        accidental = '#';
    };

    // First note of the notes to return is the starting note
    let retNotes = [note];

    // Get starting base note index
    const startBaseNoteIndex = naturals.indexOf(note[0]);
    
    // Handle theoretical keys
    let newNote;
    switch (note) {
        case 'B#':
            newNote = 'C';
            break;
        case 'Cb':
            newNote = 'B';
            break;
        case 'E#':
            newNote = 'F';
            break;
        case 'Fb':
            newNote = 'E';
            break;
        default:
            newNote = note;
    };

    // Iterate through formula, adding new notes
    let base, newI, baseI;
    for (const [i, s] of formula.entries()) {
        // Get new note (shifted by numb of semitones)
        newNote = shiftBySemitones(newNote, s, accidental=accidental);

        // Increment base note
        base = naturals[(startBaseNoteIndex + i + 1) % naturals.length];

        newI = getNoteIndex(newNote);
        baseI = getNoteIndex(base);

        if (newI === baseI) {
            retNotes.push(base);
        } else if (mod((baseI + 1), notes.length) == newI) {
            retNotes.push(base + '#')
        } else if (mod((baseI + 2), notes.length) == newI) {
            retNotes.push(base + '##')
        } else if (mod((baseI - 1), notes.length) == newI) {
            retNotes.push(base + 'b')
        } else if (mod((baseI - 2), notes.length) == newI) {
            retNotes.push(base + 'bb')
        };
    };

    return retNotes;
};
function updateOutput(note, accidental, key) {
    // Updates the output on the screen

    // Get the scale name
    let accidentalTxt, keyTxt;
    if (accidental === '#') {
        accidentalTxt = 'Sharp';
    } else if (accidental === 'b') {
        accidentalTxt = 'Flat';
    } else {
        accidentalTxt = '';
    };
    if (key === 'Maj') {
        keyTxt = 'Major';
    } else {
        keyTxt = 'Minor';
    };
    const scaleName = `${note.toUpperCase()} ${accidentalTxt} ${keyTxt}`;
    // Set inner text of underlined part of title
    document.querySelector('.output-text .underline').innerText = scaleName;

    // Get the notes in the scale
    const scaleNotes = getScale((note + accidental).trim(), key);
    // Clear note output
    const outputElem = document.querySelector('.output-notes');
    outputElem.innerHTML = '';
    scaleNotes.forEach(n => {
        outputElem.innerHTML += `<div><div>${n}</div></div>`
    });
};
function onScaleBtnClick(elem) {
    const parent = elem.parentNode;
    const row = parent.id;
    const col = Array.prototype.indexOf.call(parent.children, elem);
    switch (row) {
        case 'selection-note':
            parent.children[noteIndex].classList.remove('option-selected');
            noteIndex = col;
            note = elem.innerHTML;
            break;
        case 'selection-accidental':
            parent.children[accidentalIndex].classList.remove('option-selected');
            accidentalIndex = col;
            switch (elem.innerText.charCodeAt(0)) {
                case 9837:
                    // Flat
                    accidental = 'b';
                    break;
                case 9838:
                    // Natural
                    accidental = '';
                    break;
                case 9839:
                    // Sharp
                    accidental = '#';
                    break;
            }
            break;
        case 'selection-key':
            parent.children[keyIndex].classList.remove('option-selected');
            keyIndex = col;
            key = elem.innerHTML.slice(0, 3);
            break;
    }
    elem.classList.add('option-selected');
    updateOutput(note, accidental, key);
};

let note = 'C';
let noteIndex = 0;
let accidental = '';
let accidentalIndex = 0;
let key = 'Maj';
let keyIndex = 0;

const scaleBtns = document.querySelectorAll('.selection div');
scaleBtns.forEach(elem => {
    elem.addEventListener('click', e => {
        onScaleBtnClick(elem);
    });
});