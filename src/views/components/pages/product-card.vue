<template>
    <div v-if="product">
        <div class="vs-list">
            <div class="vs-list--item">
                <div class="list-titles">
                    <div class="vs-list--title">Type du produit</div>
                    <div class="vs-list--subtitle" > {{ product.modele.type.name }}  </div>
                </div>
            </div>
            <div class="vs-list--item">
                <div class="list-titles">
                    <div class="vs-list--title">Modèle</div>
                    <div class="vs-list--subtitle" > {{ product.modele.name }}  </div>
                </div>
            </div>
            <div class="vs-list--item">
                <div class="list-titles">
                    <div class="vs-list--title">Age</div>
                    <div class="vs-list--subtitle" > {{ product.age }} Mois  </div>
                </div>
            </div>
            <div class="vs-list--item">
                <div class="list-titles">
                    <div class="vs-list--title">Couleur</div>
                    <div class="vs-list--subtitle" > {{ product.couleur }}  </div>
                </div>
            </div>
            <div class="vs-list--item">
                <div class="list-titles">
                    <div class="vs-list--title">Description</div>
                    <div class="vs-list--subtitle" > {{ product.description }}  </div>
                </div>
            </div>
            <div class="vs-list--item">
                <div class="list-titles">
                    <div class="vs-list--title">Etat</div>
                    <div class="vs-list--subtitle" v-for="(det, index) in JSON.parse(product.state)" :key="index"  > 
                        {{ index | stateFilter }} : {{ det | stateFilter }}.
                    </div>  
            </div>
            </div>
            <div class="vs-list--slot"></div>
            
        </div>
    </div>
</template>

<script>
export default {
    props: {
        product: {
            type: Object
        }
    },
    filters: {
        stateFilter: function (value) {
            if (value == 'state_screen') return "Etat de l'écran"
            if (value == 'state_body') return "Etat de la coque"
            if (value == 'simBlocked') return "Opérteur bloqué"
            if (value == 1) return "Oui"
            if (value == 0) return "Non"
            if (value == 'storage') return "Capacité de stockage"
            return value
        }
    }
}
</script>