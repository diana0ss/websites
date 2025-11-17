const SUPABASE_URL = 'https://twfmnwjpciqybhpilksq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Zm1ud2pwY2lxeWJocGlsa3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTM1MzYsImV4cCI6MjA3NTM4OTUzNn0.yaZQwrHulES0ym4TjPQc9cEtuixounQZb5WrOqqz3KQ';

const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let livros = [];
let autores = [];
let editoras = [];
let utentes = [];
let requisicoes = [];

let livrosRaw = [];
let autoresRaw = [];
let editorasRaw = [];
let utentesRaw = [];
let requisicoesRaw = [];
let exemplaresRaw = [];

let realtimeChannel = null;
let hasRealtimeBeenAnnounced = false;

let currentSection = 'dashboard';
let currentBookFilter = 'todos';
let currentReqFilter = 'todas';

document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    bootstrapData();
});

async function bootstrapData() {
    if (!supabaseClient) {
        console.error('Supabase client não foi inicializado.');
        showNotification('Não foi possível inicializar o Supabase.', 'error');
        return;
    }

    try {
        await Promise.all([
            fetchAutoresRaw(),
            fetchEditorasRaw(),
            fetchUtentesRaw(),
            fetchLivrosRaw(),
            fetchExemplaresRaw(),
            fetchRequisicoesRaw(),
        ]);
        syncViewState();
        renderAllSections();
        setupRealtimeChannel();
    } catch (error) {
        console.error('Erro ao carregar dados iniciais', error);
        showNotification(`Erro ao carregar dados iniciais: ${error.message}`, 'error');
    }
}

async function fetchLivrosRaw() {
    const { data, error } = await supabaseClient
        .from('livro')
        .select('li_cod, li_titulo, li_ano, li_isbn, li_genero, li_autor')
        .order('li_titulo', { ascending: true });
    if (error) throw error;
    livrosRaw = data ?? [];
}

async function fetchAutoresRaw() {
    const { data, error } = await supabaseClient
        .from('autor')
        .select('au_cod, au_nome, au_pais')
        .order('au_nome', { ascending: true });
    if (error) throw error;
    autoresRaw = data ?? [];
}

async function fetchEditorasRaw() {
    const { data, error } = await supabaseClient
        .from('editora')
        .select('ed_cod, ed_nome, ed_pais, ed_email, ed_tlm')
        .order('ed_nome', { ascending: true });
    if (error) throw error;
    editorasRaw = data ?? [];
}

async function fetchUtentesRaw() {
    const { data, error } = await supabaseClient
        .from('utente')
        .select('ut_cod, ut_nome, ut_email, ut_tlm, ut_nif')
        .order('ut_nome', { ascending: true });
    if (error) throw error;
    utentesRaw = data ?? [];
}

async function fetchRequisicoesRaw() {
    const { data, error } = await supabaseClient
        .from('requisicao')
        .select('re_cod, re_ut_cod, re_lex_cod, re_data_requisicao, re_data_devolucao')
        .order('re_data_requisicao', { ascending: false });
    if (error) throw error;
    requisicoesRaw = data ?? [];
}

async function fetchExemplaresRaw() {
    const { data, error } = await supabaseClient
        .from('livro_exemplar')
        .select('lex_cod, lex_li_cod, lex_disponivel');
    if (error) throw error;
    exemplaresRaw = data ?? [];
}

function syncViewState() {
    livros = livrosRaw.map((row) => ({
        id: row.li_cod,
        titulo: row.li_titulo ?? 'Sem título',
        autorId: row.li_autor ?? null,
        autor: getAutorName(row.li_autor),
        ano: row.li_ano ?? '',
        isbn: row.li_isbn ?? '',
        genero: row.li_genero ?? 'Não definido',
        disponivel: isLivroDisponivel(row.li_cod),
    }));

    autores = autoresRaw.map((row) => ({
        id: row.au_cod,
        nome: row.au_nome ?? 'Autor',
        pais: row.au_pais ?? 'Não especificado',
        livros: livrosRaw.filter((livro) => livro.li_autor === row.au_cod).length,
    }));

    editoras = editorasRaw.map((row) => ({
        id: row.ed_cod,
        nome: row.ed_nome ?? 'Editora',
        pais: row.ed_pais ?? 'Não especificado',
        email: row.ed_email || null,
        telefone: row.ed_tlm || null,
    }));

    utentes = utentesRaw.map((row) => ({
        id: row.ut_cod,
        nome: row.ut_nome ?? 'Utente',
        email: row.ut_email ?? '',
        telefone: row.ut_tlm ?? '',
        nif: row.ut_nif ?? '',
        estado: 'Ativo',
    }));

    requisicoes = requisicoesRaw.map((row) => ({
        id: row.re_cod,
        utenteId: row.re_ut_cod,
        exemplarId: row.re_lex_cod,
        utente: getUtenteName(row.re_ut_cod),
        livro: getLivroTitleByExemplar(row.re_lex_cod),
        dataRequisicao: row.re_data_requisicao,
        dataDevolucao: row.re_data_devolucao,
        estado: row.re_data_devolucao ? 'Devolvido' : 'Ativo',
    }));
}

function renderAllSections() {
    loadDashboardData();
    loadBooks();
    loadAutores();
    loadEditoras();
    loadUtentes();
    loadRequisicoes();
}

function getAutorName(autorId) {
    if (!autorId) return 'Autor desconhecido';
    const autor = autoresRaw.find((item) => item.au_cod === autorId);
    return autor?.au_nome ?? 'Autor desconhecido';
}

function isLivroDisponivel(livroId) {
    if (!livroId) return false;
    return exemplaresRaw.some((ex) => ex.lex_li_cod === livroId && ex.lex_disponivel);
}

function getUtenteName(utenteId) {
    if (!utenteId) return 'Utente';
    const utente = utentesRaw.find((item) => item.ut_cod === utenteId);
    return utente?.ut_nome ?? `Utente #${utenteId}`;
}

function getLivroTitleByExemplar(exemplarId) {
    const exemplar = exemplaresRaw.find((ex) => ex.lex_cod === exemplarId);
    if (!exemplar) return `Exemplar #${exemplarId}`;
    const livro = livrosRaw.find((row) => row.li_cod === exemplar.lex_li_cod);
    return livro?.li_titulo ?? `Livro #${exemplar?.lex_li_cod ?? exemplarId}`;
}

function getDisponiveisCount() {
    return exemplaresRaw.filter((ex) => ex.lex_disponivel).length;
}

function getAvailableExemplares() {
    return exemplaresRaw.filter((ex) => ex.lex_disponivel);
}

function setupRealtimeChannel() {
    if (!supabaseClient || realtimeChannel) return;

    realtimeChannel = supabaseClient
        .channel('public:biblioteca-dashboard')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'livro' }, () => refreshFromSupabase(['livro', 'livro_exemplar']))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'livro_exemplar' }, () => refreshFromSupabase(['livro_exemplar']))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'autor' }, () => refreshFromSupabase(['autor', 'livro']))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'editora' }, () => refreshFromSupabase(['editora']))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'utente' }, () => refreshFromSupabase(['utente', 'requisicao']))
        .on('postgres_changes', { event: '*', schema: 'public', table: 'requisicao' }, () => refreshFromSupabase(['requisicao', 'livro_exemplar']))
        .subscribe((status) => {
            if (status === 'SUBSCRIBED' && !hasRealtimeBeenAnnounced) {
                hasRealtimeBeenAnnounced = true;
                showNotification('Ligação em tempo real ativa com o Supabase.', 'success');
            }
        });
}

async function refreshFromSupabase(tables) {
    if (!supabaseClient) return;
    const unique = new Set(tables);
    const promises = [];

    if (unique.has('livro')) promises.push(fetchLivrosRaw());
    if (unique.has('autor')) promises.push(fetchAutoresRaw());
    if (unique.has('editora')) promises.push(fetchEditorasRaw());
    if (unique.has('utente')) promises.push(fetchUtentesRaw());
    if (unique.has('requisicao')) promises.push(fetchRequisicoesRaw());
    if (unique.has('livro_exemplar') || unique.has('livro') || unique.has('requisicao')) {
        promises.push(fetchExemplaresRaw());
    }

    if (!promises.length) return;

    try {
        await Promise.all(promises);
        syncViewState();
        renderAllSections();
    } catch (error) {
        console.error('Erro ao sincronizar dados em tempo real', error);
    }
}

function updateStatValue(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

async function ensureAutorExists(nome, pais) {
    if (!supabaseClient || !nome) return null;
    const normalized = nome.trim().toLowerCase();
    const existing = autoresRaw.find((autor) => (autor.au_nome ?? '').toLowerCase() === normalized);
    if (existing) return existing.au_cod;

    const { data, error } = await supabaseClient
        .from('autor')
        .insert({ au_nome: nome.trim(), au_pais: pais || null })
        .select('au_cod, au_nome, au_pais')
        .single();

    if (error) throw error;
    autoresRaw.push(data);
    return data.au_cod;
}

async function ensureGeneroExists(genero) {
    if (!supabaseClient || !genero) return;
    const value = genero.trim();
    if (!value) return;

    const { data, error } = await supabaseClient
        .from('genero')
        .select('ge_genero')
        .eq('ge_genero', value);

    if (error) throw error;
    if (data && data.length) return;

    const { error: insertError } = await supabaseClient
        .from('genero')
        .insert({ ge_genero: value });

    // Ignorar erro de duplicado
    if (insertError && insertError.code !== '23505') {
        throw insertError;
    }
}

function initializeAnimations() {
    // Animação dos itens do sidebar
    anime({
        targets: '.sidebar-item',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutQuart'
    });

    // Animação do conteúdo principal
    anime({
        targets: '.main-content',
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 800,
        delay: 300,
        easing: 'easeOutQuart'
    });
}

function loadDashboardData() {
    updateStatValue('stat-total-livros', livros.length);
    updateStatValue('stat-total-utentes', utentes.length);
    updateStatValue('stat-requisicoes-ativas', requisicoes.filter(req => req.estado === 'Ativo').length);
    updateStatValue('stat-livros-disponiveis', getDisponiveisCount());

    // Animação dos cards de estatísticas
    anime({
        targets: '.stat-card',
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: anime.stagger(150, {start: 500}),
        duration: 600,
        easing: 'easeOutBack'
    });
}

function showSection(sectionName) {
    // Esconder todas as secções
    document.querySelectorAll('.main-content').forEach(section => {
        section.classList.add('hidden');
    });

    // Mostrar a secção selecionada
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.remove('hidden');
        
        // Animação de entrada
        anime({
            targets: `#${sectionName}`,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 400,
            easing: 'easeOutQuart'
        });
    }

    // Atualizar navegação ativa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('crimson-gradient', 'text-white', 'shadow-lg');
        link.classList.add('text-gray-700');
    });
    
    event.target.closest('.nav-link').classList.remove('text-gray-700');
    event.target.closest('.nav-link').classList.add('crimson-gradient', 'text-white', 'shadow-lg');

    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'livros': 'Gestão de Livros',
        'autores': 'Gestão de Autores',
        'editoras': 'Gestão de Editoras',
        'utentes': 'Gestão de Utentes',
        'requisicoes': 'Gestão de Requisições'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName];
    currentSection = sectionName;

    // Carregar dados específicos da secção
    switch(sectionName) {
        case 'livros':
            loadBooks();
            break;
        case 'autores':
            loadAutores();
            break;
        case 'editoras':
            loadEditoras();
            break;
        case 'utentes':
            loadUtentes();
            break;
        case 'requisicoes':
            loadRequisicoes();
            break;
    }
}

// Funções de Livros
function loadBooks() {
    const grid = document.getElementById('books-grid');
    grid.innerHTML = '';
    
    let filteredLivros = livros;
    
    // Aplicar filtros
    if (currentBookFilter === 'disponiveis') {
        filteredLivros = livros.filter(livro => livro.disponivel);
    } else if (currentBookFilter === 'requisitados') {
        filteredLivros = livros.filter(livro => !livro.disponivel);
    }
    
    filteredLivros.forEach((livro, index) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'livro-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden card-hover';
        bookCard.style.opacity = '0';
        bookCard.style.transform = 'scale(0.9)';
        
        bookCard.innerHTML = `
            <div class="h-48 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                <div class="text-center">
                    <div class="text-4xl mb-2">📖</div>
                    <p class="text-sm text-red-700 font-medium">Capa do Livro</p>
                </div>
            </div>
            <div class="p-4">
                <h3 class="font-semibold text-gray-900 mb-1 line-clamp-2">${livro.titulo}</h3>
                <p class="text-sm text-gray-600 mb-2">por ${livro.autor}</p>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>${livro.ano}</span>
                    <span class="px-2 py-1 ${livro.disponivel ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded-full">
                        ${livro.disponivel ? 'Disponível' : 'Requisitado'}
                    </span>
                </div>
                <div class="flex gap-2">
                    <button onclick="viewBook(${livro.id})" class="flex-1 px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        Ver Detalhes
                    </button>
                    <button onclick="editBook(${livro.id})" class="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        Editar
                    </button>
                </div>
            </div>
        `;
        
        grid.appendChild(bookCard);
        
        // Animação de entrada
        anime({
            targets: bookCard,
            opacity: [0, 1],
            scale: [0.9, 1],
            delay: index * 100,
            duration: 400,
            easing: 'easeOutQuart'
        });
    });
}

function searchBooks() {
    const searchTerm = document.getElementById('book-search').value.toLowerCase();
    const cards = document.querySelectorAll('.livro-card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || author.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterBooks(filter) {
    currentBookFilter = filter;
    
    // Atualizar botões de filtro
    document.querySelectorAll('[id^="filter-"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200';
    });
    document.getElementById(`filter-${filter}`).className = 'px-4 py-2 rounded-lg font-medium bg-red-600 text-white';
    
    loadBooks();
}

function viewBook(id) {
    const book = livros.find(l => l.id === id);
    alert(`Detalhes do Livro:\n\nTítulo: ${book.titulo}\nAutor: ${book.autor}\nAno: ${book.ano}\nISBN: ${book.isbn}\nGénero: ${book.genero}\nEstado: ${book.disponivel ? 'Disponível' : 'Requisitado'}`);
}

function editBook(id) {
    alert('Funcionalidade de edição em desenvolvimento. Na versão completa, aqui abriria um formulário para editar o livro.');
}

// Funções de Autores
function loadAutores() {
    const tbody = document.getElementById('autores-table');
    tbody.innerHTML = '';
    
    autores.forEach((autor, index) => {
        const row = document.createElement('tr');
        row.className = 'autor-row hover:bg-gray-50';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-red-600 font-semibold">${autor.nome.charAt(0)}</span>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${autor.nome}</div>
                        <div class="text-sm text-gray-500">Cód. ${autor.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${autor.pais}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ${autor.livros} livros
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                    <button onclick="viewAutor(${autor.id})" class="text-red-600 hover:text-red-900">Ver</button>
                    <button onclick="editAutor(${autor.id})" class="text-red-600 hover:text-red-900">Editar</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Animação de entrada
        anime({
            targets: row,
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: index * 50,
            duration: 400,
            easing: 'easeOutQuart'
        });
    });
}

function searchAutores() {
    const searchTerm = document.getElementById('autor-search').value.toLowerCase();
    const rows = document.querySelectorAll('.autor-row');
    
    rows.forEach(row => {
        const nome = row.querySelector('.text-sm.font-medium').textContent.toLowerCase();
        const pais = row.querySelectorAll('.text-sm.text-gray-900')[0].textContent.toLowerCase();
        
        if (nome.includes(searchTerm) || pais.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewAutor(id) {
    const autor = autores.find(a => a.id === id);
    alert(`Detalhes do Autor:\n\nNome: ${autor.nome}\nPaís: ${autor.pais}\nNúmero de Livros: ${autor.livros}`);
}

function editAutor(id) {
    alert('Funcionalidade de edição em desenvolvimento. Na versão completa, aqui abriria um formulário para editar o autor.');
}

// Funções de Editoras
function loadEditoras() {
    const tbody = document.getElementById('editoras-table');
    tbody.innerHTML = '';
    
    editoras.forEach((editora, index) => {
        const row = document.createElement('tr');
        row.className = 'editora-row hover:bg-gray-50';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div>
                    <div class="text-sm font-medium text-gray-900">${editora.nome}</div>
                    <div class="text-sm text-gray-500">Cód. ${editora.id}</div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${editora.pais}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                    ${editora.email ? `<div class="text-blue-600 hover:text-blue-800">${editora.email}</div>` : ''}
                    ${editora.telefone ? `<div class="text-gray-600">${editora.telefone}</div>` : ''}
                    ${!editora.email && !editora.telefone ? '<span class="text-gray-400">Sem contacto</span>' : ''}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                    <button onclick="viewEditora(${editora.id})" class="text-red-600 hover:text-red-900">Ver</button>
                    <button onclick="editEditora(${editora.id})" class="text-red-600 hover:text-red-900">Editar</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Animação de entrada
        anime({
            targets: row,
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: index * 50,
            duration: 400,
            easing: 'easeOutQuart'
        });
    });
}

function searchEditoras() {
    const searchTerm = document.getElementById('editora-search').value.toLowerCase();
    const rows = document.querySelectorAll('.editora-row');
    
    rows.forEach(row => {
        const nome = row.querySelector('.text-sm.font-medium').textContent.toLowerCase();
        const pais = row.querySelectorAll('.text-sm.text-gray-900')[0].textContent.toLowerCase();
        
        if (nome.includes(searchTerm) || pais.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewEditora(id) {
    const editora = editoras.find(e => e.id === id);
    alert(`Detalhes da Editora:\n\nNome: ${editora.nome}\nPaís: ${editora.pais}\nEmail: ${editora.email || 'Não especificado'}\nTelefone: ${editora.telefone || 'Não especificado'}`);
}

function editEditora(id) {
    alert('Funcionalidade de edição em desenvolvimento. Na versão completa, aqui abriria um formulário para editar a editora.');
}

// Funções de Utentes
function loadUtentes() {
    const tbody = document.getElementById('utentes-table');
    tbody.innerHTML = '';
    
    utentes.forEach((utente, index) => {
        const row = document.createElement('tr');
        row.className = 'utente-row hover:bg-gray-50';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <span class="text-red-600 font-semibold">${utente.nome.charAt(0)}</span>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-900">${utente.nome}</div>
                        <div class="text-sm text-gray-500">Cód. ${utente.id}</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                    ${utente.email ? `<div class="text-blue-600 hover:text-blue-800">${utente.email}</div>` : ''}
                    ${utente.telefone ? `<div class="text-gray-600">${utente.telefone}</div>` : ''}
                    ${!utente.email && !utente.telefone ? '<span class="text-gray-400">Sem contacto</span>' : ''}
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${utente.nif || 'Não especificado'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ${utente.estado}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                    <button onclick="viewUtente(${utente.id})" class="text-red-600 hover:text-red-900">Ver</button>
                    <button onclick="editUtente(${utente.id})" class="text-red-600 hover:text-red-900">Editar</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Animação de entrada
        anime({
            targets: row,
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: index * 50,
            duration: 400,
            easing: 'easeOutQuart'
        });
    });
}

function searchUtentes() {
    const searchTerm = document.getElementById('utente-search').value.toLowerCase();
    const rows = document.querySelectorAll('.utente-row');
    
    rows.forEach(row => {
        const nome = row.querySelector('.text-sm.font-medium').textContent.toLowerCase();
        const email = row.querySelector('.text-blue-600')?.textContent.toLowerCase() || '';
        const nif = row.querySelectorAll('.text-sm.text-gray-900')[1]?.textContent.toLowerCase() || '';
        
        if (nome.includes(searchTerm) || email.includes(searchTerm) || nif.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function viewUtente(id) {
    const utente = utentes.find(u => u.id === id);
    alert(`Detalhes do Utente:\n\nNome: ${utente.nome}\nEmail: ${utente.email}\nNIF: ${utente.nif}\nTelefone: ${utente.telefone}\nEstado: ${utente.estado}`);
}

function editUtente(id) {
    alert('Funcionalidade de edição em desenvolvimento. Na versão completa, aqui abriria um formulário para editar o utente.');
}

// Funções de Requisições
function loadRequisicoes() {
    const tbody = document.getElementById('requisicoes-table');
    tbody.innerHTML = '';
    
    let filteredReqs = requisicoes;
    
    // Aplicar filtros
    if (currentReqFilter === 'ativas') {
        filteredReqs = requisicoes.filter(req => req.estado === 'Ativo');
    } else if (currentReqFilter === 'devolvidas') {
        filteredReqs = requisicoes.filter(req => req.estado === 'Devolvido');
    }
    
    filteredReqs.forEach((req, index) => {
        const row = document.createElement('tr');
        row.className = 'requisicao-row hover:bg-gray-50';
        row.style.opacity = '0';
        row.style.transform = 'translateX(-20px)';
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${req.utente}</div>
                <div class="text-sm text-gray-500">Cód. ${req.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${req.livro}</div>
                <div class="text-sm text-gray-500">Exemplar #${req.id}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDate(req.dataRequisicao)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${req.dataDevolucao ? formatDate(req.dataDevolucao) : 'Pendente'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.estado === 'Devolvido' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
                    ${req.estado}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                    ${req.estado === 'Ativo' ? `<button onclick="devolverLivro(${req.id})" class="text-green-600 hover:text-green-900">Devolver</button>` : ''}
                    <button onclick="viewRequisicao(${req.id})" class="text-red-600 hover:text-red-900">Ver</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // Animação de entrada
        anime({
            targets: row,
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: index * 50,
            duration: 400,
            easing: 'easeOutQuart'
        });
    });
}

function searchRequisicoes() {
    const searchTerm = document.getElementById('requisicao-search').value.toLowerCase();
    const rows = document.querySelectorAll('.requisicao-row');
    
    rows.forEach(row => {
        const utente = row.querySelector('.text-sm.font-medium').textContent.toLowerCase();
        const livro = row.querySelectorAll('.text-sm.font-medium')[1].textContent.toLowerCase();
        
        if (utente.includes(searchTerm) || livro.includes(searchTerm)) {
            row.style.display = 'table-row';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterRequisicoes(filter) {
    currentReqFilter = filter;
    
    // Atualizar botões de filtro
    document.querySelectorAll('[id^="req-filter-"]').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200';
    });
    document.getElementById(`req-filter-${filter}`).className = 'px-4 py-2 rounded-lg font-medium bg-red-600 text-white';
    
    loadRequisicoes();
}

function devolverLivro(id) {
    if (!supabaseClient) {
        showNotification('Supabase não configurado.', 'error');
        return;
    }

    const req = requisicoes.find(r => r.id === id);
    if (!req) {
        showNotification('Requisição não encontrada.', 'error');
        return;
    }

    const hoje = new Date().toISOString().split('T')[0];

    supabaseClient
        .from('requisicao')
        .update({ re_data_devolucao: hoje })
        .eq('re_cod', id)
        .then(async ({ error }) => {
            if (error) throw error;

            const { error: exemplarError } = await supabaseClient
                .from('livro_exemplar')
                .update({ lex_disponivel: true })
                .eq('lex_cod', req.exemplarId);

            if (exemplarError) throw exemplarError;

            await Promise.all([fetchRequisicoesRaw(), fetchExemplaresRaw()]);
            syncViewState();
            renderAllSections();
            showNotification('Livro devolvido com sucesso!', 'success');
        })
        .catch((error) => {
            console.error('Erro ao devolver livro', error);
            showNotification(`Erro ao devolver livro: ${error.message}`, 'error');
        });
}

function viewRequisicao(id) {
    const req = requisicoes.find(r => r.id === id);
    alert(`Detalhes da Requisição:\n\nUtente: ${req.utente}\nLivro: ${req.livro}\nData Requisição: ${formatDate(req.dataRequisicao)}\nData Devolução: ${req.dataDevolucao ? formatDate(req.dataDevolucao) : 'Pendente'}\nEstado: ${req.estado}`);
}

// Funções do Modal
function openModal(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    switch(type) {
        case 'add-book':
            modalTitle.textContent = 'Adicionar Novo Livro';
            modalContent.innerHTML = getBookForm();
            break;
        case 'add-autor':
            modalTitle.textContent = 'Adicionar Novo Autor';
            modalContent.innerHTML = getAutorForm();
            break;
        case 'add-editora':
            modalTitle.textContent = 'Adicionar Nova Editora';
            modalContent.innerHTML = getEditoraForm();
            break;
        case 'add-utente':
            modalTitle.textContent = 'Adicionar Novo Utente';
            modalContent.innerHTML = getUtenteForm();
            break;
        case 'add-requisicao':
            modalTitle.textContent = 'Nova Requisição';
            modalContent.innerHTML = getRequisicaoForm();
            break;
    }
    
    modal.classList.remove('hidden');
    
    // Animação de entrada
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    
    // Animação de saída
    anime({
        targets: modal.querySelector('.bg-white'),
        scale: [1, 0.8],
        opacity: [1, 0],
        duration: 200,
        easing: 'easeInQuart',
        complete: () => {
            modal.classList.add('hidden');
        }
    });
}

// Formulários
function getBookForm() {
    return `
        <form onsubmit="addBook(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input type="text" name="titulo" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                    <input type="text" name="autor" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Ano</label>
                        <input type="number" name="ano" required min="1800" max="2024" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                        <input type="text" name="isbn" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Género</label>
                    <select name="genero" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="">Selecione um género</option>
                        <option value="Romance">Romance</option>
                        <option value="Clássico">Clássico</option>
                        <option value="Poesia">Poesia</option>
                        <option value="Epopeia">Epopeia</option>
                        <option value="Drama">Drama</option>
                        <option value="Comédia">Comédia</option>
                    </select>
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white crimson-gradient rounded-lg hover:shadow-lg">Adicionar Livro</button>
                </div>
            </div>
        </form>
    `;
}

function getAutorForm() {
    return `
        <form onsubmit="addAutor(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" name="nome" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input type="text" name="pais" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white crimson-gradient rounded-lg hover:shadow-lg">Adicionar Autor</button>
                </div>
            </div>
        </form>
    `;
}

function getEditoraForm() {
    return `
        <form onsubmit="addEditora(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" name="nome" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">País</label>
                        <input type="text" name="pais" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input type="text" name="telefone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white crimson-gradient rounded-lg hover:shadow-lg">Adicionar Editora</button>
                </div>
            </div>
        </form>
    `;
}

function getUtenteForm() {
    return `
        <form onsubmit="addUtente(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input type="text" name="nome" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input type="text" name="telefone" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">NIF</label>
                    <input type="text" name="nif" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white crimson-gradient rounded-lg hover:shadow-lg">Adicionar Utente</button>
                </div>
            </div>
        </form>
    `;
}

function getRequisicaoForm() {
    const exemplaresDisponiveis = getAvailableExemplares();
    const utenteOptions = utentes.length
        ? ['<option value="">Selecione um utente</option>', ...utentes.map(u => `<option value="${u.id}">${u.nome}</option>`)].join('')
        : '<option value="">Sem utentes registados</option>';
    const livroOptions = exemplaresDisponiveis.length
        ? ['<option value="">Selecione um exemplar</option>', ...exemplaresDisponiveis.map(ex => {
            const titulo = getLivroTitleByExemplar(ex.lex_cod);
            return `<option value="${ex.lex_cod}">${titulo} (Exemplar #${ex.lex_cod})</option>`;
        })].join('')
        : '<option value="">Sem exemplares disponíveis</option>';
    const utenteDisabledAttr = utentes.length ? '' : 'disabled';
    const livroDisabledAttr = exemplaresDisponiveis.length ? '' : 'disabled';

    return `
        <form onsubmit="addRequisicao(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Utente</label>
                    <select name="utente" required ${utenteDisabledAttr} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        ${utenteOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Exemplar disponível</label>
                    <select name="livro" required ${livroDisabledAttr} class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        ${livroOptions}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Data de Requisição</label>
                    <input type="date" name="dataRequisicao" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white crimson-gradient rounded-lg hover:shadow-lg" ${(!utentes.length || !exemplaresDisponiveis.length) ? 'disabled' : ''}>Criar Requisição</button>
                </div>
            </div>
        </form>
    `;
}

// Funções de submit dos formulários
async function addBook(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Supabase não configurado.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const titulo = formData.get('titulo')?.trim();
    const autorNome = formData.get('autor')?.trim();
    const ano = parseInt(formData.get('ano'), 10);
    const isbn = formData.get('isbn')?.trim();
    const genero = formData.get('genero')?.trim();

    if (!titulo) {
        showNotification('Título é obrigatório.', 'error');
        return;
    }

    try {
        let autorId = null;
        if (autorNome) {
            autorId = await ensureAutorExists(autorNome);
        }
        if (genero) {
            await ensureGeneroExists(genero);
        }

        const { data, error } = await supabaseClient
            .from('livro')
            .insert({
                li_titulo: titulo,
                li_autor: autorId,
                li_ano: Number.isFinite(ano) ? ano : null,
                li_isbn: isbn || null,
                li_genero: genero || null,
            })
            .select('li_cod')
            .single();

        if (error) throw error;

        await supabaseClient
            .from('livro_exemplar')
            .insert({ lex_li_cod: data.li_cod, lex_disponivel: true });

        await Promise.all([fetchLivrosRaw(), fetchAutoresRaw(), fetchExemplaresRaw()]);
        syncViewState();
        renderAllSections();
        closeModal();
        showNotification('Livro adicionado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao adicionar livro', error);
        showNotification(`Erro ao adicionar livro: ${error.message}`, 'error');
    }
}

async function addAutor(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Supabase não configurado.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const nome = formData.get('nome')?.trim();
    const pais = formData.get('pais')?.trim() || null;

    if (!nome) {
        showNotification('Nome do autor é obrigatório.', 'error');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('autor')
            .insert({ au_nome: nome, au_pais: pais });
        if (error) throw error;

        await fetchAutoresRaw();
        syncViewState();
        renderAllSections();
        closeModal();
        showNotification('Autor adicionado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao adicionar autor', error);
        showNotification(`Erro ao adicionar autor: ${error.message}`, 'error');
    }
}

async function addEditora(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Supabase não configurado.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const nome = formData.get('nome')?.trim();
    const pais = formData.get('pais')?.trim();
    const telefone = formData.get('telefone')?.trim();
    const email = formData.get('email')?.trim();

    if (!nome || !pais) {
        showNotification('Nome e país são obrigatórios.', 'error');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('editora')
            .insert({
                ed_nome: nome,
                ed_pais: pais,
                ed_tlm: telefone || null,
                ed_email: email || null,
            });
        if (error) throw error;

        await fetchEditorasRaw();
        syncViewState();
        renderAllSections();
        closeModal();
        showNotification('Editora adicionada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao adicionar editora', error);
        showNotification(`Erro ao adicionar editora: ${error.message}`, 'error');
    }
}

async function addUtente(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Supabase não configurado.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const nome = formData.get('nome')?.trim();
    const email = formData.get('email')?.trim();
    const telefone = formData.get('telefone')?.trim();
    const nif = formData.get('nif')?.trim();

    if (!nome) {
        showNotification('Nome do utente é obrigatório.', 'error');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('utente')
            .insert({
                ut_nome: nome,
                ut_email: email || null,
                ut_tlm: telefone || null,
                ut_nif: nif || null,
            });
        if (error) throw error;

        await fetchUtentesRaw();
        syncViewState();
        renderAllSections();
        closeModal();
        showNotification('Utente adicionado com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao adicionar utente', error);
        showNotification(`Erro ao adicionar utente: ${error.message}`, 'error');
    }
}

async function addRequisicao(event) {
    event.preventDefault();
    if (!supabaseClient) {
        showNotification('Supabase não configurado.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const utenteId = parseInt(formData.get('utente'), 10);
    const exemplarId = parseInt(formData.get('livro'), 10);
    const dataRequisicao = formData.get('dataRequisicao');

    if (!Number.isInteger(utenteId) || !Number.isInteger(exemplarId)) {
        showNotification('Selecione o utente e o exemplar.', 'error');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('requisicao')
            .insert({
                re_ut_cod: utenteId,
                re_lex_cod: exemplarId,
                re_data_requisicao: dataRequisicao || null,
            });
        if (error) throw error;

        await supabaseClient
            .from('livro_exemplar')
            .update({ lex_disponivel: false })
            .eq('lex_cod', exemplarId);

        await Promise.all([fetchRequisicoesRaw(), fetchExemplaresRaw()]);
        syncViewState();
        renderAllSections();
        closeModal();
        showNotification('Requisição criada com sucesso!', 'success');
    } catch (error) {
        console.error('Erro ao criar requisição', error);
        showNotification(`Erro ao criar requisição: ${error.message}`, 'error');
    }
}

// Funções auxiliares
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuart'
    });
    
    // Remover após 3 segundos
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInQuart',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}
