# SyncBeat // Doubly Linked List Music Player & Algorithm Visualizer

A complete, interactive Web Application designed for **Data Structures & Algorithms (DSA)** academic submissions, lab evaluations, and project vivas.

It combines a functional, Spotify-styled music player with a **real-time visualizer of a Doubly Linked List (DLL)** and an interactive **live algorithm execution console**.

---

## 🌟 Key Features

1. **Doubly Linked List Data Structure**:
   - Each song is represented as an allocated Node in memory with `title`, `artist`, `duration`, `prev`, and `next` pointers.
   - Live simulated memory addresses (e.g. `0x3FA10B`) displayed on each node to explain pointer concepts.
   - Pointers dynamically connect nodes with two-way arrows (`⇆`).
   - Dynamic tracking of `HEAD`, `TAIL`, and `CURRENT (Playback)` pointers.

2. **Full Music Player & Audio Synthesizer**:
   - **Play / Pause / Next / Prev / Volume / Seek bar**.
   - Built with the native **Web Audio API** — synthesizes pleasant ambient chords without requiring any external audio files or internet access!
   - Spinning vinyl disc & responsive frequency visualizer bars that bounce when audio plays.

3. **Linear & Circular DLL Toggle**:
   - One-click toggle between **Linear DLL** (`head.prev = NULL`, `tail.next = NULL`) and **Circular DLL** (`tail.next = head`, `head.prev = tail`) to demonstrate looping playlists.

4. **Interactive Operations**:
   - **Insert at Head** — `O(1)`
   - **Insert at Tail** — `O(1)` (using tail pointer)
   - **Insert at Index** — `O(n)` (traversal)
   - **Delete Current Track** — `O(1)`
   - **Delete Head / Delete Tail** — `O(1)`
   - **In-place Reversal of DLL** — `O(n)` (swaps `prev` and `next` pointers across all nodes)
   - **Linear Search & Play** — `O(n)`

5. **Viva & Academic Presentation Console**:
   - Displays real-time **Time Complexity** ($O(1)$, $O(n)$) and **Space Complexity** for every clicked operation.
   - Shows the exact **C++ / Java pointer manipulation code** corresponding to the action.
   - Live execution audit log with timestamps.

---

## 🚀 How to Run the Project

No dependencies, compilers, or `npm install` required!

1. Open File Explorer and navigate to:
   ```
   D:\dsa-music-player\
   ```
2. Double-click **`index.html`** to open it in **Google Chrome**, **Microsoft Edge**, **Brave**, or **Firefox**.
3. That's it! The application will load pre-configured with 4 sample tracks ready to play and inspect.

---

## 📊 Time & Space Complexity Analysis

| Operation | Time Complexity | Space Complexity | Explanation |
| :--- | :---: | :---: | :--- |
| **Next Track (`current.next`)** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | Direct pointer dereference |
| **Prev Track (`current.prev`)** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | Direct pointer dereference |
| **Insert at Head** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | Updates `newNode.next` and `head.prev` |
| **Insert at Tail** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | Direct access via `tail` pointer |
| **Insert at Arbitrary Index** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | Requires traversing $k$ nodes |
| **Delete Current Node** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | Pointer updates `prev.next` and `next.prev` |
| **Delete Head / Tail** | $\mathcal{O}(1)$ | $\mathcal{O}(1)$ | Direct update of boundary pointers |
| **Search by Title** | $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | Linear traversal through nodes |
| **Reverse Doubly Linked List**| $\mathcal{O}(n)$ | $\mathcal{O}(1)$ | In-place pointer swapping of all nodes |

---

## 🎓 Viva Questions & Answers for Examination

**Q1: Why is a Doubly Linked List preferred over a Singly Linked List for a music player?**  
> *Answer:* A Singly Linked List only has a `next` pointer, so moving to the previous song requires an $\mathcal{O}(n)$ traversal from the `head`. A Doubly Linked List has both `next` and `prev` pointers, enabling bidirectional navigation in $\mathcal{O}(1)$ constant time.

**Q2: How do you achieve $\mathcal{O}(1)$ insertion and deletion at the end of the playlist?**  
> *Answer:* By maintaining an explicit `tail` pointer alongside the `head` pointer. Without the tail pointer, reaching the end would take $\mathcal{O}(n)$ time.

**Q3: How does Circular Doubly Linked List differ from a standard Doubly Linked List?**  
> *Answer:* In a standard DLL, `head.prev = NULL` and `tail.next = NULL`. In a circular DLL, `tail.next = head` and `head.prev = tail`, creating a continuous loop ideal for a "Repeat Playlist" feature.

**Q4: How does in-place reversal work in a Doubly Linked List?**  
> *Answer:* We iterate through the list and for every node, swap its `next` and `prev` pointers. Finally, we swap the `head` and `tail` pointers. Auxiliary space is $\mathcal{O}(1)$.

---

## 📁 Project Structure

```
d:\dsa-music-player\
├── index.html       # Semantic HTML5 UI layout, controls & visualizer canvas
├── style.css        # Spotify-inspired dark UI styling, animations & glowing pointers
├── app.js           # DoublyLinkedList class, Web Audio API synthesis & event controllers
└── README.md        # Documentation, complexity tables, and viva preparation
```
