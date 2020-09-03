Fonctionnalité: Mesure de la distance entre deux textes
    Deux textes sont comparable par le nombre de caractères dont ils diffèrent.
    Les ajouts, les changements et les suppressions sont correctement comptées.
    Les textes de tailles différentes sont supportés.

Scénario: Une mesure de zéro signifie l'égalité des textes
    Soit un premier texte "abbacca"
    Et un second texte "abbacca"
    Quand je mesure la distance entre ces deux textes
    Alors la distance est de 0 caractère

Scénario: Les caractères ajoutés sont comptés
    Soit un premier texte "abbacca"
    Et un second texte "abbanccat"
    Quand je mesure la distance entre ces deux textes
    Alors la distance est de 2 caractères

Scénario: Les caractères supprimés sont comptés
    Soit un premier texte "abbacca"
    Et un second texte "abaca"
    Quand je mesure la distance entre ces deux textes
    Alors la distance est de 2 caractères

Scénario: Les caractères ajoutés et supprimés sont comptés ensembles
    Soit un premier texte "abbacca"
    Et un second texte "zabacat"
    Quand je mesure la distance entre ces deux textes
    Alors la distance est de 4 caractères

Scénario: Les caractères remplacés comptent comme ajout et suppression
    Soit un premier texte "abbacca"
    Et un second texte "abbocca"
    Quand je mesure la distance entre ces deux textes
    Alors la distance est de 2 caractères

