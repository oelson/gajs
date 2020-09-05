Fonctionnalité: Processus évolutif

Scénario: Population vide
    Soit une population UTF-8 vide
    Et un cycle de vie éternel
    Et une condition d'arrêt sur population vide
    Quand on crée les générations de cette population
    Alors on a 0 génération

Scénario: Population de deux
    Soit la population UTF-8
        | lambda |
        | gamma  |
    Et un cycle de vie éternel
    Et une condition d'arrêt au delà de 10 générations
    Quand on crée les générations de cette population
    Alors on a 10 générations
    Et un individu de la dernière génération est "lambda"