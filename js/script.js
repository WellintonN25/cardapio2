        const cardapio = [
          {
            id: 1,
            categoria: "comidas",
            nome: "Frango Frito",
            descricao: "frango frito a moda da casa com arroz feijao e saladas.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/2232433/pexels-photo-2232433.jpeg",
          },
          {
            id: 2,
            categoria: "comidas",
            nome: "Bisteca",
            descricao: "bisteca frita da hora com acompanhamentos.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/3743389/pexels-photo-3743389.jpeg",
          },
          {
            id: 3,
            categoria: "comidas",
            nome: "Bife acebolado",
            descricao: "um bife acebolado a moda da casa, huuuum explendido.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/18852581/pexels-photo-18852581.jpeg",
          },
          {
            id: 4,
            categoria: "comidas",
            nome: "assado de panela",
            descricao: "uma assado de panela com calabresa no jeito.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg",
          },
          {
            id: 5,
            categoria: "comidas",
            nome: "Carne moida",
            descricao: "um refogado de dar agua na boca.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/2226991/pexels-photo-2226991.jpeg",
          },
          {
            id: 6,
            categoria: "comidas",
            nome: "Peixe frito",
            descricao: "Peixe frito crocante por fora, macio por dentro, servido quentinho e cheio de sabor.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/16121287/pexels-photo-16121287.jpeg",
          },
          {
            id: 7,
            categoria: "comidas",
            nome: "Frango assado",
            descricao: "Frango assado dourado, suculento e temperado na medida certa.",
            preco: 15.0,
            imagem:
              "https://images.pexels.com/photos/15532964/pexels-photo-15532964.jpeg",
          },
          {
            id: 8,
            categoria: "bebidas",
            nome: "Coca-Cola Lata",
            descricao: "350ml bem gelada.",
            preco: 6.0,
            imagem:
              "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80",
          },
          {
            id: 9,
            categoria: "bebidas",
            nome: "Suco Natural",
            descricao: "Laranja 500ml.",
            preco: 8.0,
            imagem:
              "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&q=80",
          },
        ];

        let carrinho = [];
        let categoriaAtual = 'comidas'; // Define a categoria inicial
        let isEntrega = false;
        const VALOR_FRETE = 5.00;

        window.onload = function() {
            carregarDadosUsuario();
            renderizarCardapio(); // Renderiza e aplica a classe 'active' correta
        };

        function renderizarCardapio() {
            const container = document.getElementById('menu-items');
            const itensFiltrados = cardapio.filter(item => item.categoria === categoriaAtual);

            container.innerHTML = itensFiltrados.map(item => `
                <div class="product-card">
                    <img src="${item.imagem}" alt="${item.nome}" class="product-img" loading="lazy">
                    <div class="product-info">
                        <h3 class="product-title">${item.nome}</h3>
                        <p class="product-desc">${item.descricao}</p>
                        <div class="price-row">
                            <span class="product-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</span>
                            <button class="add-btn" onclick="adicionarAoCarrinho(${item.id})">Adicionar</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // LÓGICA DE ABAS CORRIGIDA
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                // Agora comparamos o ID interno (data-category) com a variável
                if(btn.dataset.category === categoriaAtual) {
                    btn.classList.add('active');
                }
            });
        }

        function mudarCategoria(cat) { 
            categoriaAtual = cat; 
            renderizarCardapio(); 
        }

        // --- MANIPULAÇÃO DO CARRINHO ---
        function adicionarAoCarrinho(id) {
            const item = cardapio.find(p => p.id === id);
            carrinho.push({...item, cartId: Date.now()}); 
            atualizarBarraInferior();
        }

        function removerDoCarrinho(index) {
            carrinho.splice(index, 1); 
            atualizarBarraInferior();
            renderizarListaCarrinho();
            calcularTotalModal();
        }

        function atualizarBarraInferior() {
            const total = carrinho.reduce((acc, item) => acc + item.preco, 0);
            document.getElementById('bar-count').innerText = carrinho.length;
            document.getElementById('bar-total').innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
        }

        // --- INTERFACE DE USUÁRIO (MODAL) ---
        function abrirCarrinho() {
            renderizarListaCarrinho();
            calcularTotalModal();
            document.getElementById('modal-cart').classList.add('open');
            document.body.classList.add('modal-open');
        }

        function fecharCarrinho() {
            document.getElementById('modal-cart').classList.remove('open');
            document.body.classList.remove('modal-open');
        }

        function selecionarEntrega(valor) {
            isEntrega = valor;
            const btnRetirada = document.getElementById('opt-retirada');
            const btnEntrega = document.getElementById('opt-entrega');
            const divEndereco = document.getElementById('div-endereco');

            if (isEntrega) {
                btnEntrega.classList.add('selected');
                btnRetirada.classList.remove('selected');
                divEndereco.classList.remove('hidden');
            } else {
                btnRetirada.classList.add('selected');
                btnEntrega.classList.remove('selected');
                divEndereco.classList.add('hidden');
            }
            calcularTotalModal();
        }

        function renderizarListaCarrinho() {
            const lista = document.getElementById('cart-list');
            if (carrinho.length === 0) {
                lista.innerHTML = '<div style="text-align:center; padding:20px; color:#999">Sua sacola está vazia.</div>';
                return;
            }
            lista.innerHTML = carrinho.map((item, index) => `
                <div class="cart-item">
                    <div>
                        <div style="font-weight:600">${item.nome}</div>
                        <div style="color:#777; font-size:0.9rem">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <button class="remove-btn" onclick="removerDoCarrinho(${index})">Remover</button>
                </div>
            `).join('');
        }

        function calcularTotalModal() {
            const subtotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
            const custoFrete = isEntrega ? VALOR_FRETE : 0;
            
            document.getElementById('modal-subtotal').innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            document.getElementById('modal-frete').innerText = isEntrega ? `R$ ${VALOR_FRETE.toFixed(2).replace('.', ',')}` : 'Grátis';
            document.getElementById('modal-total-final').innerText = `R$ ${(subtotal + custoFrete).toFixed(2).replace('.', ',')}`;
        }

        // --- PERSISTÊNCIA DE DADOS ---
        function carregarDadosUsuario() {
            const nomeSalvo = localStorage.getItem('user_nome');
            const telSalvo = localStorage.getItem('user_telefone');
            const endSalvo = localStorage.getItem('user_endereco');

            if (nomeSalvo) document.getElementById('input-nome').value = nomeSalvo;
            if (telSalvo) document.getElementById('input-telefone').value = telSalvo;
            if (endSalvo) document.getElementById('input-endereco').value = endSalvo;
        }

        function salvarDadosUsuario(nome, telefone, endereco) {
            localStorage.setItem('user_nome', nome);
            localStorage.setItem('user_telefone', telefone);
            if(endereco) localStorage.setItem('user_endereco', endereco);
        }

        // --- WHATSAPP ---
        function finalizarPedido() {
            if (carrinho.length === 0) { alert("Sua sacola está vazia!"); return; }

            const nome = document.getElementById('input-nome').value.trim();
            const telefone = document.getElementById('input-telefone').value.trim();
            const endereco = document.getElementById('input-endereco').value.trim();

            if (!nome || !telefone) {
                alert("Por favor, preencha seu Nome e Telefone.");
                return;
            }
            if (isEntrega && !endereco) {
                alert("Para entrega, precisamos do seu endereço.");
                return;
            }

            salvarDadosUsuario(nome, telefone, endereco);

            const numeroWhatsApp = "5568992412833"; // COLOQUE SEU NÚMERO AQUI
            
            const subtotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
            const custoFrete = isEntrega ? VALOR_FRETE : 0;
            const total = subtotal + custoFrete;

            let mensagem = `*NOVO PEDIDO DO SITE* 📋\n`;
            mensagem += `Cliente: *${nome}*\n`;
            mensagem += `Telefone: *${telefone}*\n`;
            mensagem += `----------------------------\n`;

            const resumo = {};
            carrinho.forEach(item => { resumo[item.nome] = (resumo[item.nome] || 0) + 1; });
            for (const [nome, qtd] of Object.entries(resumo)) { mensagem += `${qtd}x ${nome}\n`; }
            
            mensagem += `----------------------------\n`;
            mensagem += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
            
            if (isEntrega) {
                mensagem += `Entrega: R$ ${custoFrete.toFixed(2).replace('.', ',')}\n`;
                mensagem += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
                mensagem += `\n📍 *Endereço de Entrega:*\n${endereco}`;
            } else {
                mensagem += `Retirada no Balcão (Grátis)\n`;
                mensagem += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*`;
            }

            window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
        }

        document.getElementById('modal-cart').addEventListener('click', function(e) {
            if (e.target === this) fecharCarrinho();
        });