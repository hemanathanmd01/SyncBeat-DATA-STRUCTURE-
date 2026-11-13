/**
 * SyncBeat - Doubly Linked List (DLL) Music Player & Algorithm Visualizer
 * Core Data Structures Project
 */

// Helper: Generate simulated memory address for nodes
function generateAddress() {
  return '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
}

// Helper: Format seconds to M:SS
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ----------------------------------------------------
// 1. DATA STRUCTURE DEFINITION: Node & DoublyLinkedList
// ----------------------------------------------------

class SongNode {
  constructor(title, artist, duration = 180, chord = [261.63, 329.63, 392.00]) {
    this.address = generateAddress(); // Simulated memory pointer
    this.title = title;
    this.artist = artist;
    this.duration = duration;
    this.chord = chord; // Frequencies for Web Audio synth (e.g., C major)
    
    // DLL Pointers
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.size = 0;
    this.isCircular = false;
  }

  // Insert at beginning: O(1)
  insertHead(title, artist, duration, chord) {
    const newNode = new SongNode(title, artist, duration, chord);
    
    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
      if (this.isCircular) {
        newNode.next = newNode;
        newNode.prev = newNode;
      }
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      
      if (this.isCircular) {
        newNode.prev = this.tail;
        this.tail.next = newNode;
      } else {
        newNode.prev = null;
      }
      
      this.head = newNode;
    }
    
    this.size++;
    return {
      node: newNode,
      code: `// C++ / Java equivalent: O(1)
Node* newNode = new Node("${title}", "${artist}");
if (!head) {
    head = tail = current = newNode;
} else {
    newNode->next = head;
    head->prev = newNode;
    head = newNode;
}`
    };
  }

  // Insert at end: O(1) using tail pointer
  insertTail(title, artist, duration, chord) {
    const newNode = new SongNode(title, artist, duration, chord);

    if (this.size === 0) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
      if (this.isCircular) {
        newNode.next = newNode;
        newNode.prev = newNode;
      }
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;

      if (this.isCircular) {
        newNode.next = this.head;
        this.head.prev = newNode;
      } else {
        newNode.next = null;
      }

      this.tail = newNode;
    }

    this.size++;
    return {
      node: newNode,
      code: `// C++ / Java equivalent: O(1)
Node* newNode = new Node("${title}", "${artist}");
if (!head) {
    head = tail = current = newNode;
} else {
    tail->next = newNode;
    newNode->prev = tail;
    tail = newNode;
}`
    };
  }

  // Insert at arbitrary index: O(n)
  insertAt(index, title, artist, duration, chord) {
    if (index < 0 || index > this.size) return null;

    if (index === 0) {
      const res = this.insertHead(title, artist, duration, chord);
      res.opName = `Insert at Head (Index 0) [O(1)]`;
      return res;
    }

    if (index === this.size) {
      const res = this.insertTail(title, artist, duration, chord);
      res.opName = `Insert at Tail (Index ${index}) [O(1)]`;
      return res;
    }

    // Traverse to position
    let temp = this.head;
    for (let i = 0; i < index - 1; i++) {
      temp = temp.next;
    }

    const newNode = new SongNode(title, artist, duration, chord);
    newNode.next = temp.next;
    newNode.prev = temp;

    if (temp.next) {
      temp.next.prev = newNode;
    }
    temp.next = newNode;

    this.size++;
    return {
      node: newNode,
      time: 'O(n)',
      space: 'O(1)',
      opName: `Insert at Index ${index}`,
      code: `// C++ / Java equivalent: O(n) traversal
Node* temp = head;
for (int i = 0; i < ${index - 1}; i++) temp = temp->next;
Node* newNode = new Node("${title}", "${artist}");
newNode->next = temp->next;
newNode->prev = temp;
temp->next->prev = newNode;
temp->next = newNode;`
    };
  }

  // Delete head node: O(1)
  deleteHead() {
    if (!this.head) return null;

    const removed = this.head;

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
      this.current = null;
    } else {
      if (this.current === this.head) {
        this.current = this.head.next;
      }
      this.head = this.head.next;

      if (this.isCircular) {
        this.head.prev = this.tail;
        this.tail.next = this.head;
      } else {
        this.head.prev = null;
      }
    }

    this.size--;
    return {
      node: removed,
      time: 'O(1)',
      space: 'O(1)',
      opName: `Delete Head Node (${removed.title})`,
      code: `// C++ / Java equivalent: O(1)
Node* temp = head;
head = head->next;
if (head) head->prev = nullptr;
delete temp;`
    };
  }

  // Delete tail node: O(1)
  deleteTail() {
    if (!this.tail) return null;

    const removed = this.tail;

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
      this.current = null;
    } else {
      if (this.current === this.tail) {
        this.current = this.tail.prev;
      }
      this.tail = this.tail.prev;

      if (this.isCircular) {
        this.tail.next = this.head;
        this.head.prev = this.tail;
      } else {
        this.tail.next = null;
      }
    }

    this.size--;
    return {
      node: removed,
      time: 'O(1)',
      space: 'O(1)',
      opName: `Delete Tail Node (${removed.title})`,
      code: `// C++ / Java equivalent: O(1)
Node* temp = tail;
tail = tail->prev;
if (tail) tail->next = nullptr;
delete temp;`
    };
  }

  // Delete specific node: O(1) if pointer is given
  deleteNode(targetNode) {
    if (!targetNode || this.size === 0) return null;

    if (targetNode === this.head) return this.deleteHead();
    if (targetNode === this.tail) return this.deleteTail();

    // Node is in the middle
    if (this.current === targetNode) {
      this.current = targetNode.next || targetNode.prev;
    }

    targetNode.prev.next = targetNode.next;
    targetNode.next.prev = targetNode.prev;

    this.size--;
    return {
      node: targetNode,
      time: 'O(1)',
      space: 'O(1)',
      opName: `Delete Node (${targetNode.title})`,
      code: `// C++ / Java equivalent: O(1)
targetNode->prev->next = targetNode->next;
targetNode->next->prev = targetNode->prev;
delete targetNode;`
    };
  }

  // Search by title: O(n)
  search(title) {
    if (!this.head) return null;

    let temp = this.head;
    let index = 0;
    const lower = title.trim().toLowerCase();

    do {
      if (temp.title.toLowerCase().includes(lower)) {
        return { node: temp, index };
      }
      temp = temp.next;
      index++;
    } while (temp && temp !== this.head);

    return null;
  }

  // Reverse Doubly Linked List in-place: O(n)
  reverse() {
    if (!this.head || this.size <= 1) return;

    let current = this.head;
    let temp = null;
    let count = 0;

    // Swap next and prev for all nodes
    while (current && count < this.size) {
      temp = current.prev;
      current.prev = current.next;
      current.next = temp;
      current = current.prev; // Since prev & next were swapped, move to old next
      count++;
    }

    // Swap head and tail pointers
    temp = this.head;
    this.head = this.tail;
    this.tail = temp;

    return {
      time: 'O(n)',
      space: 'O(1)',
      opName: 'Reverse Doubly Linked List',
      code: `// C++ / Java DLL In-place Reversal:
Node* current = head;
Node* temp = nullptr;
while (current != nullptr) {
    temp = current->prev;
    current->prev = current->next;
    current->next = temp;
    current = current->prev;
}
if (temp != nullptr) {
    head = temp->prev;
}`
    };
  }

  // Toggle Circular mode
  toggleCircular() {
    this.isCircular = !this.isCircular;
    if (this.size > 0) {
      if (this.isCircular) {
        this.tail.next = this.head;
        this.head.prev = this.tail;
      } else {
        this.tail.next = null;
        this.head.prev = null;
      }
    }
  }

  // Pointer traversal: Move to Next Track
  getNext() {
    if (!this.current) return null;
    if (this.current.next) {
      this.current = this.current.next;
      return this.current;
    }
    return null;
  }

  // Pointer traversal: Move to Previous Track
  getPrev() {
    if (!this.current) return null;
    if (this.current.prev) {
      this.current = this.current.prev;
      return this.current;
    }
    return null;
  }
}

// ----------------------------------------------------
// 2. AUDIO SYNTHESIZER ENGINE (Web Audio API)
// ----------------------------------------------------

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.gainNode = null;
    this.analyser = null;
    this.volume = 0.7;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChord(frequencies) {
    this.stop();
    this.init();

    this.isPlaying = true;
    const now = this.ctx.currentTime;

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Warm analog synthesizer waveform mix
      osc.type = idx === 0 ? 'sine' : idx === 1 ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Gentle pulsating envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.2 / frequencies.length, now + 0.3);
      
      osc.connect(noteGain);
      noteGain.connect(this.gainNode);
      osc.start();

      this.oscillators.push({ osc, gain: noteGain });
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.oscillators.length > 0) {
      this.oscillators.forEach(({ osc, gain }) => {
        try {
          gain.gain.setValueAtTime(gain.gain.value, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
          setTimeout(() => osc.stop(), 120);
        } catch (e) {}
      });
      this.oscillators = [];
    }
  }

  setVolume(val) {
    this.volume = val;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(val, this.ctx.currentTime);
    }
  }
}

// ----------------------------------------------------
// 3. APPLICATION STATE & CONTROLLER
// ----------------------------------------------------

const playlist = new DoublyLinkedList();
const audio = new AudioEngine();

let trackPlaybackSeconds = 0;
let playbackTimer = null;

// UI Element Selectors
const dom = {
  // Header
  nodeCount: document.getElementById('nodeCount'),
  listModeLabel: document.getElementById('listModeLabel'),
  toggleCircularBtn: document.getElementById('toggleCircularBtn'),
  circularBtnText: document.getElementById('circularBtnText'),

  // Player
  currentNodeAddress: document.getElementById('currentNodeAddress'),
  vinylDisc: document.getElementById('vinylDisc'),
  vinylCenter: document.getElementById('vinylCenter'),
  audioBars: document.getElementById('audioBars'),
  trackTitle: document.getElementById('trackTitle'),
  trackArtist: document.getElementById('trackArtist'),
  progressBarContainer: document.getElementById('progressBarContainer'),
  progressFill: document.getElementById('progressFill'),
  currentTimeText: document.getElementById('currentTimeText'),
  durationText: document.getElementById('durationText'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  playPauseBtn: document.getElementById('playPauseBtn'),
  playIcon: document.getElementById('playIcon'),
  pauseIcon: document.getElementById('pauseIcon'),
  volumeSlider: document.getElementById('volumeSlider'),
  reverseListBtn: document.getElementById('reverseListBtn'),

  // Visualizer Canvas
  listCanvas: document.getElementById('listCanvas'),

  // Operations
  songTitleInput: document.getElementById('songTitleInput'),
  songArtistInput: document.getElementById('songArtistInput'),
  songPosInput: document.getElementById('songPosInput'),
  insertHeadBtn: document.getElementById('insertHeadBtn'),
  insertTailBtn: document.getElementById('insertTailBtn'),
  insertPosBtn: document.getElementById('insertPosBtn'),
  deleteCurrentBtn: document.getElementById('deleteCurrentBtn'),
  deleteHeadBtn: document.getElementById('deleteHeadBtn'),
  deleteTailBtn: document.getElementById('deleteTailBtn'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),

  // DSA Code & Complexity Display
  timeComplexity: document.getElementById('timeComplexity'),
  spaceComplexity: document.getElementById('spaceComplexity'),
  lastOpName: document.getElementById('lastOpName'),
  codeSnippet: document.getElementById('codeSnippet'),
  auditLog: document.getElementById('auditLog'),
  clearLogBtn: document.getElementById('clearLogBtn'),
};

// ----------------------------------------------------
// 4. RENDERING & UI UPDATES
// ----------------------------------------------------

function updatePlayerUI() {
  const cur = playlist.current;

  if (!cur) {
    dom.trackTitle.innerText = "No Track Selected";
    dom.trackArtist.innerText = "Add songs to start playlist";
    dom.currentNodeAddress.innerText = "Node: NULL";
    dom.currentTimeText.innerText = "0:00";
    dom.durationText.innerText = "0:00";
    dom.progressFill.style.width = "0%";
    dom.prevBtn.disabled = true;
    dom.nextBtn.disabled = true;
    pauseTrack();
    return;
  }

  dom.trackTitle.innerText = cur.title;
  dom.trackArtist.innerText = cur.artist;
  dom.currentNodeAddress.innerText = `Node: ${cur.address}`;
  dom.durationText.innerText = formatTime(cur.duration);
  dom.currentTimeText.innerText = formatTime(trackPlaybackSeconds);
  dom.progressFill.style.width = `${(trackPlaybackSeconds / cur.duration) * 100}%`;

  // Control button states in linear mode
  if (!playlist.isCircular) {
    dom.prevBtn.disabled = cur.prev === null;
    dom.nextBtn.disabled = cur.next === null;
  } else {
    dom.prevBtn.disabled = false;
    dom.nextBtn.disabled = false;
  }
}

function renderVisualizer(highlightNode = null) {
  dom.listCanvas.innerHTML = '';
  dom.nodeCount.innerText = playlist.size;

  if (playlist.size === 0) {
    dom.listCanvas.innerHTML = `<div class="null-node">[ Empty List: Head = NULL, Tail = NULL ]</div>`;
    return;
  }

  // Left Terminal indicator: NULL or Circular Loopback
  if (!playlist.isCircular) {
    const nullLeft = document.createElement('div');
    nullLeft.className = 'null-node';
    nullLeft.innerText = 'NULL ⇦ head.prev';
    dom.listCanvas.appendChild(nullLeft);

    const leftConn = document.createElement('div');
    leftConn.className = 'link-connector';
    leftConn.innerHTML = '<span class="arrow-backward">⇠</span>';
    dom.listCanvas.appendChild(leftConn);
  }

  // Traverse all nodes
  let temp = playlist.head;
  let count = 0;

  while (temp && count < playlist.size) {
    const nodeWrapper = document.createElement('div');
    nodeWrapper.className = 'node-wrapper';

    const nodeCard = document.createElement('div');
    nodeCard.className = `node-item ${temp === playlist.current ? 'is-current' : ''} ${temp === highlightNode ? 'is-highlighted' : ''}`;
    nodeCard.dataset.address = temp.address;

    // Badges container
    const badgeContainer = document.createElement('div');
    badgeContainer.className = 'node-badges';

    if (temp === playlist.head) {
      badgeContainer.innerHTML += `<span class="badge badge-head">HEAD</span>`;
    }
    if (temp === playlist.tail) {
      badgeContainer.innerHTML += `<span class="badge badge-tail">TAIL</span>`;
    }
    if (temp === playlist.current) {
      badgeContainer.innerHTML += `<span class="badge badge-current">CURRENT</span>`;
    }

    // Node Data Section
    const dataSection = document.createElement('div');
    dataSection.className = 'node-data-area';
    dataSection.innerHTML = `
      <div class="node-title" title="${temp.title}">${temp.title}</div>
      <div class="node-meta">${temp.artist} • ${formatTime(temp.duration)}</div>
    `;

    // Pointer address bar (prev | next)
    const pointerBar = document.createElement('div');
    pointerBar.className = 'node-pointer-bar';
    const prevAddr = temp.prev ? temp.prev.address : 'NULL';
    const nextAddr = temp.next ? temp.next.address : 'NULL';

    pointerBar.innerHTML = `
      <div class="pointer-slot">
        <span class="p-label">prev</span>
        <span class="p-val">${prevAddr}</span>
      </div>
      <div class="pointer-slot">
        <span class="p-label">next</span>
        <span class="p-val">${nextAddr}</span>
      </div>
    `;

    nodeCard.appendChild(badgeContainer);
    nodeCard.appendChild(dataSection);
    nodeCard.appendChild(pointerBar);

    // Clicking a node selects it as current
    const clickedNode = temp;
    nodeCard.addEventListener('click', () => {
      playlist.current = clickedNode;
      trackPlaybackSeconds = 0;
      updatePlayerUI();
      renderVisualizer();
      logOperation(`Navigated pointer directly to: "${clickedNode.title}" (${clickedNode.address})`, 'op');
      updateCodeBox('Pointer Jump: current = targetNode', 'O(1)', 'O(1)', `// Direct node selection: O(1)
current = targetNode;`);
      if (audio.isPlaying) {
        audio.playChord(clickedNode.chord);
      }
    });

    nodeWrapper.appendChild(nodeCard);
    dom.listCanvas.appendChild(nodeWrapper);

    // Inter-node two-way arrow connectors
    if (count < playlist.size - 1) {
      const conn = document.createElement('div');
      conn.className = 'link-connector';
      conn.innerHTML = `
        <div class="arrow-pair">
          <span class="arrow-forward">➔ next</span>
          <span class="arrow-backward">prev 🠔</span>
        </div>
      `;
      dom.listCanvas.appendChild(conn);
    }

    temp = temp.next;
    count++;
  }

  // Right Terminal indicator: NULL or Circular Loop
  if (!playlist.isCircular) {
    const rightConn = document.createElement('div');
    rightConn.className = 'link-connector';
    rightConn.innerHTML = '<span class="arrow-forward">➔</span>';
    dom.listCanvas.appendChild(rightConn);

    const nullRight = document.createElement('div');
    nullRight.className = 'null-node';
    nullRight.innerText = 'tail.next ➔ NULL';
    dom.listCanvas.appendChild(nullRight);
  } else {
    // Show circular connection badge
    const circConn = document.createElement('div');
    circConn.className = 'circular-loop-bar';
    circConn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"></polyline>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
      </svg>
      Circular Loop Active (tail.next = head ⇆ head.prev = tail)
    `;
    dom.listCanvas.appendChild(circConn);
  }

  // Auto scroll current node into view smoothly
  const currentNodeElem = dom.listCanvas.querySelector('.node-item.is-current');
  if (currentNodeElem) {
    currentNodeElem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function updateCodeBox(opName, time, space, code) {
  dom.lastOpName.innerText = `Operation: ${opName}`;
  dom.timeComplexity.innerText = time;
  dom.spaceComplexity.innerText = space;
  dom.codeSnippet.innerText = code;
}

function logOperation(message, type = 'normal') {
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  entry.innerText = `[${timestamp}] ${message}`;
  dom.auditLog.prepend(entry);
}

// ----------------------------------------------------
// 5. PLAYBACK & MEDIA ACTIONS
// ----------------------------------------------------

function playTrack() {
  if (!playlist.current) return;

  audio.init();
  audio.playChord(playlist.current.chord);

  dom.playIcon.classList.add('hidden');
  dom.pauseIcon.classList.remove('hidden');
  dom.vinylDisc.classList.add('spinning');
  dom.audioBars.classList.add('active');

  clearInterval(playbackTimer);
  playbackTimer = setInterval(() => {
    trackPlaybackSeconds++;
    if (trackPlaybackSeconds >= playlist.current.duration) {
      trackPlaybackSeconds = 0;
      // Auto move to next track in DLL
      if (playlist.current.next) {
        playlist.current = playlist.current.next;
        updatePlayerUI();
        renderVisualizer();
        audio.playChord(playlist.current.chord);
        logOperation(`Track completed. Auto-advanced via current.next to "${playlist.current.title}"`, 'op');
      } else {
        pauseTrack();
      }
    }
    updatePlayerUI();
  }, 1000);
}

function pauseTrack() {
  audio.stop();
  dom.playIcon.classList.remove('hidden');
  dom.pauseIcon.classList.add('hidden');
  dom.vinylDisc.classList.remove('spinning');
  dom.audioBars.classList.remove('active');
  clearInterval(playbackTimer);
}

function togglePlay() {
  if (audio.isPlaying) {
    pauseTrack();
    logOperation("Playback paused.", "normal");
  } else {
    playTrack();
    logOperation(`Now playing: "${playlist.current ? playlist.current.title : 'None'}"`, "op");
  }
}

// ----------------------------------------------------
// 6. EVENT LISTENERS
// ----------------------------------------------------

// Play / Pause
dom.playPauseBtn.addEventListener('click', togglePlay);

// Next Track: current = current.next (O(1))
dom.nextBtn.addEventListener('click', () => {
  const nextNode = playlist.getNext();
  if (nextNode) {
    trackPlaybackSeconds = 0;
    updatePlayerUI();
    renderVisualizer();
    if (audio.isPlaying) audio.playChord(nextNode.chord);

    logOperation(`Next track: Traversed current = current.next ➔ "${nextNode.title}"`, 'op');
    updateCodeBox('Next Track [O(1)]', 'O(1)', 'O(1)', `// Forward Traversal: O(1)
if (current->next != nullptr) {
    current = current->next;
}`);
  } else {
    logOperation('End of playlist reached (current.next is NULL).', 'warn');
  }
});

// Previous Track: current = current.prev (O(1))
dom.prevBtn.addEventListener('click', () => {
  const prevNode = playlist.getPrev();
  if (prevNode) {
    trackPlaybackSeconds = 0;
    updatePlayerUI();
    renderVisualizer();
    if (audio.isPlaying) audio.playChord(prevNode.chord);

    logOperation(`Prev track: Traversed current = current.prev ➔ "${prevNode.title}"`, 'op');
    updateCodeBox('Previous Track [O(1)]', 'O(1)', 'O(1)', `// Backward Traversal: O(1)
if (current->prev != nullptr) {
    current = current->prev;
}`);
  } else {
    logOperation('Beginning of playlist reached (current.prev is NULL).', 'warn');
  }
});

// Toggle Circular Mode
dom.toggleCircularBtn.addEventListener('click', () => {
  playlist.toggleCircular();

  if (playlist.isCircular) {
    dom.toggleCircularBtn.classList.add('circular-active');
    dom.circularBtnText.innerText = 'Make Linear';
    dom.listModeLabel.innerText = 'Circular DLL';
    logOperation('Switched to Circular DLL: tail.next ➔ head, head.prev ➔ tail', 'system');
    updateCodeBox('Toggle Circular DLL [O(1)]', 'O(1)', 'O(1)', `// Connect endpoints:
tail->next = head;
head->prev = tail;`);
  } else {
    dom.toggleCircularBtn.classList.remove('circular-active');
    dom.circularBtnText.innerText = 'Make Circular';
    dom.listModeLabel.innerText = 'Linear DLL';
    logOperation('Switched to Linear DLL: tail.next = NULL, head.prev = NULL', 'system');
    updateCodeBox('Toggle Linear DLL [O(1)]', 'O(1)', 'O(1)', `// Disconnect endpoints:
tail->next = nullptr;
head->prev = nullptr;`);
  }

  updatePlayerUI();
  renderVisualizer();
});

// Insert at Head
dom.insertHeadBtn.addEventListener('click', () => {
  const title = dom.songTitleInput.value.trim() || `Track #${playlist.size + 1}`;
  const artist = dom.songArtistInput.value.trim() || 'Synth Artist';
  const chords = [
    [261.63, 329.63, 392.00], // C
    [293.66, 369.99, 440.00], // D
    [329.63, 415.30, 493.88], // E
    [349.23, 440.00, 523.25]  // F
  ];
  const chord = chords[playlist.size % chords.length];

  const res = playlist.insertHead(title, artist, 180 + Math.floor(Math.random() * 60), chord);
  dom.songTitleInput.value = '';
  dom.songArtistInput.value = '';

  updatePlayerUI();
  renderVisualizer(res.node);
  logOperation(`Inserted "${title}" at HEAD [O(1)]`, 'op');
  updateCodeBox('Insert at Head [O(1)]', 'O(1)', 'O(1)', res.code);
});

// Insert at Tail
dom.insertTailBtn.addEventListener('click', () => {
  const title = dom.songTitleInput.value.trim() || `Track #${playlist.size + 1}`;
  const artist = dom.songArtistInput.value.trim() || 'Synth Artist';
  const chords = [
    [220.00, 261.63, 329.63], // A minor
    [174.61, 220.00, 261.63], // F
    [196.00, 246.94, 293.66], // G
    [146.83, 174.61, 220.00]  // D minor
  ];
  const chord = chords[playlist.size % chords.length];

  const res = playlist.insertTail(title, artist, 190 + Math.floor(Math.random() * 50), chord);
  dom.songTitleInput.value = '';
  dom.songArtistInput.value = '';

  updatePlayerUI();
  renderVisualizer(res.node);
  logOperation(`Inserted "${title}" at TAIL [O(1)]`, 'op');
  updateCodeBox('Insert at Tail [O(1)]', 'O(1)', 'O(1)', res.code);
});

// Insert at Position
dom.insertPosBtn.addEventListener('click', () => {
  const index = parseInt(dom.songPosInput.value);
  if (isNaN(index)) {
    alert("Please enter a valid numeric index.");
    return;
  }
  if (index < 0 || index > playlist.size) {
    alert(`Index out of bounds! Valid range: 0 to ${playlist.size}`);
    return;
  }

  const title = dom.songTitleInput.value.trim() || `Track Pos #${index}`;
  const artist = dom.songArtistInput.value.trim() || 'Guest Artist';
  const chord = [261.63, 349.23, 440.00];

  const res = playlist.insertAt(index, title, artist, 200, chord);
  dom.songTitleInput.value = '';
  dom.songArtistInput.value = '';
  dom.songPosInput.value = '';

  updatePlayerUI();
  renderVisualizer(res.node);
  logOperation(`Inserted "${title}" at index ${index} [${res.time}]`, 'op');
  updateCodeBox(res.opName, res.time, res.space, res.code);
});

// Delete Current Track
dom.deleteCurrentBtn.addEventListener('click', () => {
  if (!playlist.current) {
    logOperation("No current track to delete.", "warn");
    return;
  }
  const deletedTitle = playlist.current.title;
  const res = playlist.deleteNode(playlist.current);

  trackPlaybackSeconds = 0;
  updatePlayerUI();
  renderVisualizer();
  logOperation(`Deleted current track "${deletedTitle}" [O(1)]`, 'op');
  updateCodeBox(res.opName, res.time, res.space, res.code);
});

// Delete Head
dom.deleteHeadBtn.addEventListener('click', () => {
  if (playlist.size === 0) {
    logOperation("List is already empty.", "warn");
    return;
  }
  const res = playlist.deleteHead();
  trackPlaybackSeconds = 0;
  updatePlayerUI();
  renderVisualizer();
  logOperation(res.opName + " [O(1)]", 'op');
  updateCodeBox(res.opName, res.time, res.space, res.code);
});

// Delete Tail
dom.deleteTailBtn.addEventListener('click', () => {
  if (playlist.size === 0) {
    logOperation("List is already empty.", "warn");
    return;
  }
  const res = playlist.deleteTail();
  trackPlaybackSeconds = 0;
  updatePlayerUI();
  renderVisualizer();
  logOperation(res.opName + " [O(1)]", 'op');
  updateCodeBox(res.opName, res.time, res.space, res.code);
});

// Reverse DLL
dom.reverseListBtn.addEventListener('click', () => {
  if (playlist.size <= 1) {
    logOperation("Need at least 2 nodes to reverse.", "warn");
    return;
  }
  const res = playlist.reverse();
  updatePlayerUI();
  renderVisualizer();
  logOperation("Reversed entire Doubly Linked List in-place [O(n)]", 'op');
  updateCodeBox(res.opName, res.time, res.space, res.code);
});

// Search & Play
dom.searchBtn.addEventListener('click', () => {
  const query = dom.searchInput.value.trim();
  if (!query) return;

  logOperation(`Initiating linear traversal for: "${query}"...`, 'system');
  const result = playlist.search(query);

  if (result) {
    playlist.current = result.node;
    trackPlaybackSeconds = 0;
    updatePlayerUI();
    renderVisualizer(result.node);
    if (audio.isPlaying) audio.playChord(result.node.chord);

    logOperation(`Found "${result.node.title}" at node index ${result.index} [O(n)]`, 'op');
    updateCodeBox(`Search by Title [O(n)]`, 'O(n)', 'O(1)', `// Linear Search Traversal: O(n)
Node* temp = head;
while (temp != nullptr) {
    if (temp->title == target) {
        current = temp;
        break;
    }
    temp = temp->next;
}`);
  } else {
    logOperation(`Track "${query}" not found in list.`, 'error');
  }
});

// Volume control
dom.volumeSlider.addEventListener('input', (e) => {
  audio.setVolume(parseFloat(e.target.value));
});

// Clear Log
dom.clearLogBtn.addEventListener('click', () => {
  dom.auditLog.innerHTML = '';
});

// Seek bar click
dom.progressBarContainer.addEventListener('click', (e) => {
  if (!playlist.current) return;
  const rect = dom.progressBarContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
  trackPlaybackSeconds = Math.floor(ratio * playlist.current.duration);
  updatePlayerUI();
});

// ----------------------------------------------------
// 7. INITIAL SAMPLE DATA
// ----------------------------------------------------

function loadSampleData() {
  playlist.insertTail(
    "Midnight City Pulse", 
    "Synthwave Dreams", 
    204, 
    [220.00, 261.63, 329.63] // Am
  );
  
  playlist.insertTail(
    "Cosmic Binary", 
    "Algorithmic Lo-Fi", 
    165, 
    [261.63, 329.63, 392.00] // C
  );

  playlist.insertTail(
    "Pointer Drift", 
    "Cyber Chill", 
    190, 
    [174.61, 220.00, 261.63] // F
  );

  playlist.insertTail(
    "Recursive Memories", 
    "Ambient Echoes", 
    242, 
    [196.00, 246.94, 293.66] // G
  );

  // Set current to head
  playlist.current = playlist.head;
  updatePlayerUI();
  renderVisualizer();
  updateCodeBox("Initial State: Doubly Linked List", "O(1)", "O(n)", `// Doubly Linked List initialized with 4 songs.
// Head points to Node 1 ("Midnight City Pulse")
// Tail points to Node 4 ("Recursive Memories")`);
}

// Start app
window.addEventListener('DOMContentLoaded', () => {
  loadSampleData();
});
