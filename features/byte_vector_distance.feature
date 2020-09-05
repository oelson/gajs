Fonctionnalité: Mesure de la distance entre deux vecteurs d'octets
    Deux vecteurs d'octets sont comparable par le nombre de bits dont ils diffèrent.
    Les ajouts, les changements et les suppressions sont correctement comptées.
    Les vecteurs de taille différentes sont supportés.

Scénario: Une mesure de zéro signifie l'égalité des vecteurs
    Soit un premier vecteur UInt8
        | 1 | 2 | 3 |
    Et un second vecteur UInt8
        | 1 | 2 | 3 |
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 0 bit

Scénario: La comparaison de deux vecteurs différents d'un octet et de deux bits
    Soit un premier vecteur UInt8
        | 1 | 2 | 3 |
    Et un second vecteur UInt8
        | 1 | 5 | 3 |
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 2 bits

Scénario: L'ajout d'un octet est compté comme 8 bits'
    Soit un premier vecteur UInt8
        | 1 | 2 | 3 |
    Et un second vecteur UInt8
        | 1 | 2 | 3 | 4 |
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 8 bits

Scénario: La suppression d'un octet est comptée comme huit bits
    Soit un premier vecteur UInt8
        | 1 | 2 | 3 |
    Et un second vecteur UInt8
        | 1 | 3 |
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 8 bits

Scénario: Les remplacements comptent comme ajout et suppression
    Soit un premier vecteur UInt8
        | 3 | 0 | 4 |
    Et un second vecteur UInt8
        | 3 | 1 | 4 |
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 2 bits