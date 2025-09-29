document.addEventListener('DOMContentLoaded', () => {
    // Pastikan FASHION_TERMS sudah dimuat dari data.js
    if (typeof FASHION_TERMS === 'undefined') {
        console.error('FASHION_TERMS data not loaded. Check data.js file.');
        return;
    }

    const termsList = document.getElementById('terms-list');
    const searchBox = document.getElementById('search-box');
    const alphabetFilter = document.getElementById('alphabet-filter');
    
    let activeLetter = 'ALL';

    // --- 1. Fungsi Utama untuk Menampilkan Data ---
   // --- 1. Fungsi Utama untuk Menampilkan Data (Dengan Animasi) ---
    const renderTerms = (terms) => {
        termsList.innerHTML = ''; // Kosongkan daftar saat ini

        if (terms.length === 0) {
            termsList.innerHTML = `<div id="no-results">Tidak ada istilah yang ditemukan. 🧐</div>`; // Tambahkan emoji
            return;
        }

        const groupedTerms = terms.reduce((acc, term) => {
            const initial = term.term.charAt(0).toUpperCase();
            if (!acc[initial]) {
                acc[initial] = [];
            }
            acc[initial].push(term);
            return acc;
        }, {});

        const sortedInitials = Object.keys(groupedTerms).sort();

        // Render ke HTML
        sortedInitials.forEach((initial, groupIndex) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'term-group';
            groupDiv.id = `group-${initial}`;
            
            // Buat elemen H2 dan tambahkan kelas fade-in setelah sedikit delay
            const h2 = document.createElement('h2');
            h2.textContent = initial;
            groupDiv.appendChild(h2);
            // Animasi untuk H2
            setTimeout(() => {
                h2.classList.add('fade-in');
            }, 50 * groupIndex);


            groupedTerms[initial].forEach((item, itemIndex) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'term-item';
                itemDiv.innerHTML = `
                    <h3>${item.term}</h3>
                    <p>${item.definition}</p>
                `;
                groupDiv.appendChild(itemDiv);

                // Animasi berurutan (staggered fade-in)
                const delay = (groupIndex * 150) + (itemIndex * 50); // Delay untuk setiap item
                setTimeout(() => {
                    itemDiv.classList.add('fade-in');
                }, delay);
            });

            termsList.appendChild(groupDiv);
        });
    };

    // --- 2. Fungsi untuk Membuat Tombol Abjad (A-Z) ---
    const setupAlphabetFilter = () => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const allBtn = document.createElement('button');
        allBtn.textContent = 'ALL';
        allBtn.className = 'alphabet-btn active';
        allBtn.dataset.letter = 'ALL';
        alphabetFilter.appendChild(allBtn);

        alphabet.forEach(letter => {
            const btn = document.createElement('button');
            btn.textContent = letter;
            btn.className = 'alphabet-btn';
            btn.dataset.letter = letter;
            alphabetFilter.appendChild(btn);
        });
    };
    
    // --- 3. Logika Filter dan Search ---
    const filterAndSearch = () => {
        const searchTerm = searchBox.value.toLowerCase().trim();
        let filteredTerms = FASHION_TERMS;

        // Filter berdasarkan Huruf Aktif
        if (activeLetter !== 'ALL') {
            filteredTerms = filteredTerms.filter(term => 
                term.term.charAt(0).toUpperCase() === activeLetter
            );
        }

        // Filter berdasarkan Kata Kunci (Search)
        if (searchTerm) {
            filteredTerms = filteredTerms.filter(term => 
                term.term.toLowerCase().includes(searchTerm) || 
                term.definition.toLowerCase().includes(searchTerm)
            );
        }
        
        renderTerms(filteredTerms);
    };

    // --- 4. Event Listeners ---
    
    // Event listener untuk kotak pencarian
    searchBox.addEventListener('keyup', () => {
        // Reset filter abjad saat mulai mengetik di search box
        activeLetter = 'ALL';
        document.querySelectorAll('.alphabet-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.letter === 'ALL') {
                btn.classList.add('active');
            }
        });
        filterAndSearch();
    });

    // Event listener untuk tombol filter abjad
    alphabetFilter.addEventListener('click', (e) => {
        if (e.target.classList.contains('alphabet-btn')) {
            // Hapus kelas 'active' dari semua tombol
            document.querySelectorAll('.alphabet-btn').forEach(btn => 
                btn.classList.remove('active')
            );
            
            // Atur huruf aktif baru
            activeLetter = e.target.dataset.letter;
            e.target.classList.add('active');
            
            // Kosongkan kotak pencarian saat memfilter abjad
            searchBox.value = '';
            
            filterAndSearch();
        }
    });

    // --- Inisialisasi ---
    setupAlphabetFilter();
    // Tampilkan semua istilah saat halaman dimuat
    renderTerms(FASHION_TERMS); 
});