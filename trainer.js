(function () {
  "use strict";

  const noteMap = {
    "-1": {
      0x0: "c/-1",
      0x1: "c#/-1",
      0x2: "d/-1",
      0x3: "eb/-1",
      0x4: "e/-1",
      0x5: "f/-1",
      0x6: "f#/-1",
      0x7: "g/-1",
      0x8: "g#/-1",
      0x9: "a/-1",
      0x0a: "bb/-1",
      0x0b: "b/-1",
    },
    "0": {
      0x0c: "c/0",
      0x0d: "c#/0",
      0x0e: "d/0",
      0x0f: "eb/0",
      0x10: "e/0",
      0x11: "f/0",
      0x12: "f#/0",
      0x13: "g/0",
      0x14: "g#/0",
      0x15: "a/0",
      0x16: "bb/0",
      0x17: "b/0",
    },
    "1": {
      0x18: "c/1",
      0x19: "c#/1",
      0x1a: "d/1",
      0x1b: "eb/1",
      0x1c: "e/1",
      0x1d: "f/1",
      0x1e: "f#/1",
      0x1f: "g/1",
      0x20: "g#/1",
      0x21: "a/1",
      0x22: "bb/1",
      0x23: "b/1",
    },
    "2": {
      0x24: "c/2",
      0x25: "c#/2",
      0x26: "d/2",
      0x27: "eb/2",
      0x28: "e/2",
      0x29: "f/2",
      0x2a: "f#/2",
      0x2b: "g/2",
      0x2c: "g#/2",
      0x2d: "a/2",
      0x2e: "bb/2",
      0x2f: "b/2",
    },
    "3": {
      0x30: "c/3",
      0x31: "c#/3",
      0x32: "d/3",
      0x33: "eb/3",
      0x34: "e/3",
      0x35: "f/3",
      0x36: "f#/3",
      0x37: "g/3",
      0x38: "g#/3",
      0x39: "a/3",
      0x3a: "bb/3",
      0x3b: "b/3",
    },
    "4": {
      0x3c: "c/4",
      0x3d: "c#/4",
      0x3e: "d/4",
      0x3f: "eb/4",
      0x40: "e/4",
      0x41: "f/4",
      0x42: "f#/4",
      0x43: "g/4",
      0x44: "g#/4",
      0x45: "a/4",
      0x46: "bb/4",
      0x47: "b/4",
    },
    "5": {
      0x48: "c/5",
      0x49: "c#/5",
      0x4a: "d/5",
      0x4b: "eb/5",
      0x4c: "e/5",
      0x4d: "f/5",
      0x4e: "f#/5",
      0x4f: "g/5",
      0x50: "g#/5",
      0x51: "a/5",
      0x52: "bb/5",
      0x53: "b/5",
    },
    "6": {
      0x54: "c/6",
      0x55: "c#/6",
      0x56: "d/6",
      0x57: "eb/6",
      0x58: "e/6",
      0x59: "f/6",
      0x5a: "f#/6",
      0x5b: "g/6",
      0x5c: "g#/6",
      0x5d: "a/6",
      0x5e: "bb/6",
      0x5f: "b/6",
    },
    "7": {
      0x60: "c/7",
      0x61: "c#/7",
      0x62: "d/7",
      0x63: "eb/7",
      0x64: "e/7",
      0x65: "f/7",
      0x66: "f#/7",
      0x67: "g/7",
      0x68: "g#/7",
      0x69: "a/7",
      0x6a: "bb/7",
      0x6b: "b/7",
    },
    "8": {
      0x6c: "c/8",
      0x6d: "c#/8",
      0x6e: "d/8",
      0x6f: "eb/8",
      0x70: "e/8",
      0x71: "f/8",
      0x72: "f#/8",
      0x73: "g/8",
      0x74: "g#/8",
      0x75: "a/8",
      0x76: "bb/8",
      0x77: "b/8"
    }
  };

  const VF = Vex.Flow;

  let noteTimeStart;

// Create an SVG renderer and attach it to the DIV element named "boo".
  let $div = $("#boo");

  let renderer = new VF.Renderer($div.get(0), VF.Renderer.Backends.SVG);
  renderer.resize(500, 200);

  let context = renderer.getContext();
  context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

  let stave = new VF.Stave(10, 40, 200);
  stave.addClef("treble");
  stave.setContext(context).draw();

  function renderNote(note, duration, key) {
    $div.find(".vf-stavenote").remove();
    $div.data("key", key);
    $div.data("duration", duration);

    let staveNote = new VF.StaveNote({
      clef: "treble",
      keys: [note],
      duration: `${duration}d`
    });

    if (note.indexOf("#") > -1) {
      staveNote.addAccidental(0, new VF.Accidental("#"));
    }

    VF.Formatter.FormatAndDraw(context, stave, [staveNote]);
  }

  const $info = $("#info");

  function info(note, duration) {
    let msg = `Note: ${note},  Duration: ${duration}`;
    $info.html(msg);
    console.log(msg);
  }

  function getSelectedOctaves() {
    let selectedOctaves = $("#octaves").val().split(",").filter(i => i.length);
    let availableOctaves = Object.keys(noteMap);

    let res;
    if (selectedOctaves.length) {
      res = availableOctaves.filter(n => selectedOctaves.includes(n))
    } else {
      res = availableOctaves;
    }
    return res;
  }

  function nextNote() {
    const durations = [1, 2, 4, 8, 4, 2, 1, 8];
    let idx = Math.floor(Math.random() * durations.length);
    let duration = durations[idx];

    let octaves = getSelectedOctaves();
    let notes = (function () {
      let objList = [];
      for (let key in noteMap) {
        if (noteMap.hasOwnProperty(key)) {
          if (octaves.includes(key)) {
            objList.push(noteMap[key]);
          }
        }
      }
      return Object.assign.apply(null, objList);
    }());

    idx = Math.floor(Math.random() * Object.keys(notes).length);
    let key = Object.keys(notes)[idx];
    let note = Object.values(notes)[idx];

    renderNote(note, duration, key);

    info(note, duration);
  }

  function initMIDI() {
    let $notes;
    let supportsMIDI = false;
    let midiContext = null;

    window.addEventListener("load", function () {
      // patch up prefixes
      window.AudioContext = window.AudioContext || window.webkitAudioContext;

      $notes = document.getElementById("notes");
      midiContext = new AudioContext();
      if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
        supportsMIDI = true;
      }
      else {
        alert("No MIDI support present in your browser. You're gonna have a bad time.");
      }
    });

    function onMIDIInit(midi) {
      let haveAtLeastOneDevice = false;
      const inputs = midi.inputs.values();
      for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = MIDIMessageEventHandler;
        haveAtLeastOneDevice = true;
      }
      if (!haveAtLeastOneDevice)
        alert("No MIDI input devices present.  You're gonna have a bad time.");
    }

    function onMIDIReject(err) {
      alert("The MIDI system failed to start.  You're gonna have a bad time.");
    }
  }

  function MIDIMessageEventHandler(event) {
    let key = event.data[1];
    switch (event.data[0] & 0xf0) {
      case 0x90:
        if (event.data[2] !== 0) {  // if velocity != 0, this is a note-on message
          noteTimeStart = new Date();
          return;
        }
      // if velocity == 0, fall thru: it's a note-off.
      case 0x80:
        const noteTimeEnd = new Date();
        checkNote(key, noteTimeEnd - noteTimeStart);
        return;
    }
  }

  function checkNote(key, duration) {
    let expectedKey = parseInt($div.data("key"), 10);
    if (expectedKey === key) {
      nextNote();
    }
    console.log(`${expectedKey} / ${key} - ${duration}`);
  }

  $("#next-note").click(nextNote);

  nextNote();
  initMIDI();
}());
