Fonctionnalité: Réduction d'une population aux plus aptes

Scénario: Survie des voyelles
    Soit la population UTF-8
        | aaa |
        | fff |
        | bbb |
        | eee |
        | ccc |
        | ooo |
        | ddd |
        | iii |
    Et une fonction de sélection par la présence de voyelles
    Et un percentile de survie de 50%
    Quand on tronque la population
    Alors la population UTF-8 contient
        | aaa |
        | eee |
        | iii |
        | ooo |
    Et la population UTF-8 ne contient pas
        | fff |
        | bbb |
        | ccc |
        | ddd |