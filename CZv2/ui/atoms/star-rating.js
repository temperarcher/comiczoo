// CZv2/ui/atoms/star-rating.js

export const STAR_RATING = {
    /**
     * Renderizza il sistema a stelle
     * @param {number} value - Valore da 1 a 5
     * @param {boolean} isAdmin - Se true, abilita l'interazione
     */
    RENDER: (value, isAdmin = false) => {
        const condizione = value || 0;
        
        // Atomo Stella Singola (SVG)
        const renderStar = (index, isFilled, isInteractive) => {
            const activeClass = isFilled 
                ? 'text-yellow-500 fill-yellow-500 shadow-glow-gold' 
                : 'text-slate-600 fill-none';
            
            const interactiveClass = isInteractive 
                ? 'group-hover:scale-110 active:scale-95 cursor-pointer hover:text-yellow-400' 
                : '';

            return `
                <div class="star-btn transition-all duration-300 ${interactiveClass} ${activeClass}" 
                     data-star="${index}">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
            `;
        };

        const stars = [1, 2, 3, 4, 5].map(i => renderStar(i, i <= condizione, isAdmin)).join('');

        return `
            <div class="flex items-center gap-1.5 ${isAdmin ? 'group/rating' : ''}" id="star-rating-container">
                ${stars}
                ${isAdmin ? `<input type="hidden" id="edit-issue-condizione" value="${condizione}">` : ''}
            </div>
        `;
    }
};