// Inicializa ícones Lucide
lucide.createIcons();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('generator-form');
    const btnGenerate = document.getElementById('btn-generate');
    const loadingState = document.getElementById('loading-state');
    const resultSection = document.getElementById('result-section');
    const btnCopy = document.getElementById('btn-copy');
    const btnNew = document.getElementById('btn-new');
    const toast = document.getElementById('toast');

    // Elementos de Preview
    const copyOutput = document.getElementById('copy-output');
    const productImage = document.getElementById('product-image');
    const productTitle = document.getElementById('product-title');
    const productPrice = document.getElementById('product-price');
    const productStore = document.getElementById('product-store');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const url = document.getElementById('url').value;
        const cupom = document.getElementById('cupom').value;
        const style = document.getElementById('style').value;

        if (!url) return;

        // UI State: Loading
        btnGenerate.disabled = true;
        btnGenerate.innerHTML = `<i data-lucide="loader-2" class="spin"></i><span>Gerando...</span>`;
        lucide.createIcons();
        
        form.parentElement.style.display = 'none';
        resultSection.style.display = 'none';
        loadingState.style.display = 'block';

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, cupom, style })
            });

            const data = await res.json();

            if (data.error || !data.success) {
                throw new Error(data.error || "Ocorreu um erro ao gerar a copy.");
            }

            // Atualiza Interface com os dados do Produto
            if (data.product) {
                productImage.src = data.product.image || "https://via.placeholder.com/150";
                productTitle.textContent = data.product.title;
                productPrice.textContent = data.product.price_current || "Oferta";
                productStore.textContent = data.product.store || "Loja Parceira";
            }

            // Atualiza Interface com a Copy gerada
            copyOutput.textContent = data.copy;

            // UI State: Result
            loadingState.style.display = 'none';
            resultSection.style.display = 'flex';

        } catch (error) {
            alert(error.message);
            // Reverter estado
            form.parentElement.style.display = 'block';
            loadingState.style.display = 'none';
            btnGenerate.disabled = false;
            btnGenerate.innerHTML = `<i data-lucide="sparkles"></i><span>Gerar Copy Mágica</span>`;
            lucide.createIcons();
        }
    });

    // Copiar para área de transferência
    btnCopy.addEventListener('click', () => {
        const textToCopy = copyOutput.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast("Texto copiado para a área de transferência!");
            
            // Efeito de feedback no botão
            const originalHtml = btnCopy.innerHTML;
            btnCopy.innerHTML = `<i data-lucide="check"></i> Copiado`;
            btnCopy.style.background = "var(--success)";
            btnCopy.style.borderColor = "var(--success)";
            lucide.createIcons();

            setTimeout(() => {
                btnCopy.innerHTML = originalHtml;
                btnCopy.style.background = "";
                btnCopy.style.borderColor = "";
                lucide.createIcons();
            }, 2000);
        }).catch(err => {
            console.error('Falha ao copiar:', err);
            alert('Não foi possível copiar o texto automaticamente.');
        });
    });

    // Resetar para gerar nova copy
    btnNew.addEventListener('click', () => {
        resultSection.style.display = 'none';
        form.parentElement.style.display = 'block';
        
        // Reset botão gerar
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = `<i data-lucide="sparkles"></i><span>Gerar Copy Mágica</span>`;
        lucide.createIcons();

        // Limpar os campos (opcional, aqui limpamos apenas cupom por conveniência)
        document.getElementById('cupom').value = '';
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
