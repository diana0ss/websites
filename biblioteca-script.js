// Dados mockados para demonstração
let livros = [
    { id: 1, titulo: "Dom Quixote", autor: "Miguel de Cervantes", ano: 1605, isbn: "978-3-16-148410-0", disponivel: true, genero: "Clássico" },
    { id: 2, titulo: "Os Lusíadas", autor: "Luís de Camões", ano: 1572, isbn: "978-85-359-0271-2", disponivel: false, genero: "Epopeia" },
    { id: 3, titulo: "Memorial do Convento", autor: "José Saramago", ano: 1982, isbn: "978-972-21-0921-3", disponivel: true, genero: "Romance" },
    { id: 4, titulo: "A Cidade e as Serras", autor: "Eça de Queirós", ano: 1901, isbn: "978-972-25-0221-0", disponivel: true, genero: "Romance" },
    { id: 5, titulo: "Ensaio Sobre a Cegueira", autor: "José Saramago", ano: 1995, isbn: "978-972-21-0922-0", disponivel: false, genero: "Romance" },
    { id: 6, titulo: "O Primo Basílio", autor: "Eça de Queirós", ano: 1878, isbn: "978-972-25-0222-7", disponivel: true, genero: "Romance" },
    { id: 7, titulo: "Mensagem", autor: "Fernando Pessoa", ano: 1934, isbn: "978-972-25-0223-4", disponivel: true, genero: "Poesia" },
    { id: 8, titulo: "Amor de Perdição", autor: "Camilo Castelo Branco", ano: 1862, isbn: "978-972-25-0224-1", disponivel: true, genero: "Romance" }
];

let autores = [
    { id: 1, nome: "Miguel de Cervantes", pais: "Espanha", livros: 1 },
    { id: 2, nome: "Luís de Camões", pais: "Portugal", livros: 1 },
    { id: 3, nome: "José Saramago", pais: "Portugal", livros: 2 },
    { id: 4, nome: "Eça de Queirós", pais: "Portugal", livros: 2 },
    { id: 5, nome: "Fernando Pessoa", pais: "Portugal", livros: 1 },
    { id: 6, nome: "Camilo Castelo Branco", pais: "Portugal", livros: 1 }
];

let editoras = [
    { id: 1, nome: "Porto Editora", pais: "Portugal", email: "info@portoeditora.pt", telefone: "22 507 34 00" },
    { id: 2, nome: "Caminho", pais: "Portugal", email: "caminho@grupo.portoeditora.pt", telefone: "21 940 83 00" },
    { id: 3, nome: "Dom Quixote", pais: "Portugal", email: "info@domquixote.pt", telefone: "21 397 55 00" },
    { id: 4, nome: "Presença", pais: "Portugal", email: "presenca@portoeditora.pt", telefone: "21 940 83 50" },
    { id: 5, nome: "Europa-América", pais: "Portugal", email: "europa@europa-america.pt", telefone: "21 397 55 10" }
];

let utentes = [
    { id: 1, nome: "João Silva", email: "joao.silva@email.com", nif: "123456789", telefone: "912345678", estado: "Ativo" },
    { id: 2, nome: "Maria Santos", email: "maria.santos@email.com", nif: "987654321", telefone: "923456789", estado: "Ativo" },
    { id: 3, nome: "Pedro Oliveira", email: "pedro.oliveira@email.com", nif: "456789123", telefone: "934567890", estado: "Ativo" },
    { id: 4, nome: "Ana Costa", email: "ana.costa@email.com", nif: "789123456", telefone: "945678901", estado: "Ativo" },
    { id: 5, nome: "Carlos Pereira", email: "carlos.pereira@email.com", nif: "321654987", telefone: "956789012", estado: "Ativo" },
    { id: 6, nome: "Sofia Ferreira", email: "sofia.ferreira@email.com", nif: "654987321", telefone: "967890123", estado: "Ativo" }
];

let requisicoes = [
    { id: 1, utente: "João Silva", livro: "Os Lusíadas", dataRequisicao: "2024-10-15", dataDevolucao: null, estado: "Ativo" },
    { id: 2, utente: "Maria Santos", livro: "Ensaio Sobre a Cegueira", dataRequisicao: "2024-10-10", dataDevolucao: null, estado: "Ativo" },
    { id: 3, utente: "Pedro Oliveira", livro: "Dom Quixote", dataRequisicao: "2024-10-05", dataDevolucao: "2024-10-20", estado: "Devolvido" },
    { id: 4, utente: "Ana Costa", livro: "Memorial do Convento", dataRequisicao: "2024-10-18", dataDevolucao: null, estado: "Ativo" },
    { id: 5, utente: "Carlos Pereira", livro: "A Cidade e as Serras", dataRequisicao: "2024-10-12", dataDevolucao: "2024-10-25", estado: "Devolvido" }
];

// Variáveis de estado
let currentSection = 'dashboard';
let currentBookFilter = 'todos';
let currentReqFilter = 'todas';

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    loadDashboardData();
});

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
    const req = requisicoes.find(r => r.id === id);
    if (req) {
        req.dataDevolucao = new Date().toISOString().split('T')[0];
        req.estado = 'Devolvido';
        
        // Atualizar disponibilidade do livro
        const livro = livros.find(l => l.titulo === req.livro);
        if (livro) {
            livro.disponivel = true;
        }
        
        loadRequisicoes();
        showNotification('Livro devolvido com sucesso!', 'success');
    }
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
    const livrosDisponiveis = livros.filter(l => l.disponivel);
    
    return `
        <form onsubmit="addRequisicao(event)">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Utente</label>
                    <select name="utente" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="">Selecione um utente</option>
                        ${utentes.map(u => `<option value="${u.nome}">${u.nome}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Livro Disponível</label>
                    <select name="livro" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <option value="">Selecione um livro</option>
                        ${livrosDisponiveis.map(l => `<option value="${l.titulo}">${l.titulo}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Data de Requisição</label>
                    <input type="date" name="dataRequisicao" required value="${new Date().toISOString().split('T')[0]}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                </div>
                <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" onclick="closeModal()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button>
                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white crimson-gradient rounded-lg hover:shadow-lg">Criar Requisição</button>
                </div>
            </div>
        </form>
    `;
}

// Funções de submit dos formulários
function addBook(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newBook = {
        id: livros.length + 1,
        titulo: formData.get('titulo'),
        autor: formData.get('autor'),
        ano: parseInt(formData.get('ano')),
        isbn: formData.get('isbn'),
        genero: formData.get('genero'),
        disponivel: true
    };
    
    livros.push(newBook);
    closeModal();
    loadBooks();
    showNotification('Livro adicionado com sucesso!', 'success');
}

function addAutor(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newAutor = {
        id: autores.length + 1,
        nome: formData.get('nome'),
        pais: formData.get('pais') || 'Não especificado',
        livros: 0
    };
    
    autores.push(newAutor);
    closeModal();
    loadAutores();
    showNotification('Autor adicionado com sucesso!', 'success');
}

function addEditora(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newEditora = {
        id: editoras.length + 1,
        nome: formData.get('nome'),
        pais: formData.get('pais'),
        email: formData.get('email') || null,
        telefone: formData.get('telefone') || null
    };
    
    editoras.push(newEditora);
    closeModal();
    loadEditoras();
    showNotification('Editora adicionada com sucesso!', 'success');
}

function addUtente(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newUtente = {
        id: utentes.length + 1,
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone') || null,
        nif: formData.get('nif') || null,
        estado: 'Ativo'
    };
    
    utentes.push(newUtente);
    closeModal();
    loadUtentes();
    showNotification('Utente adicionado com sucesso!', 'success');
}

function addRequisicao(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const utenteNome = formData.get('utente');
    const livroTitulo = formData.get('livro');
    
    // Verificar se o livro está disponível
    const livro = livros.find(l => l.titulo === livroTitulo);
    if (!livro || !livro.disponivel) {
        showNotification('Livro não está disponível!', 'error');
        return;
    }
    
    const newReq = {
        id: requisicoes.length + 1,
        utente: utenteNome,
        livro: livroTitulo,
        dataRequisicao: formData.get('dataRequisicao'),
        dataDevolucao: null,
        estado: 'Ativo'
    };
    
    requisicoes.push(newReq);
    
    // Atualizar disponibilidade do livro
    livro.disponivel = false;
    
    closeModal();
    loadRequisicoes();
    
    // Se estiver na secção de livros, atualizar a visualização
    if (currentSection === 'livros') {
        loadBooks();
    }
    
    showNotification('Requisição criada com sucesso!', 'success');
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