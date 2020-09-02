Fonctionnalité: Mesure de la distance entre deux vecteurs d'octets
    Deux vecteurs d'octets sont comparable par le nombre de bits dont ils diffèrent.
    Une mesure de zéro signifie l'égalité.
    Les ajouts, les changements et les suppressions sont correctement comptées.
    Les vecteurs de taille différentes sont supportés.

Scénario: Comparaison de deux vecteurs indentiques
    Soit un premier vecteur d'octets "1,2,3"
    Et un second vecteur d'octets "1,2,3"
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 0

Scénario: Comparison of two vectors of same length that differ in one byte
    Soit un premier vecteur d'octets "1,2,3"
    Et un second vecteur d'octets "1,5,3"
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 2

Scénario: Comparison of two vectors of same length with one replacement and two additions
    Soit un premier vecteur d'octets "1,2,3"
    Et un second vecteur d'octets "1,5,3,7,8"
    Quand je mesure la distance entre ces deux vecteurs d'octets
    Alors la distance est de 16
