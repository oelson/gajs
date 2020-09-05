Fonctionnalité: Remplacement d'une lettre dans un texte

Scénario: Remplacement configuré
    Soit un texte "abbacca"
    Et l'alphabet "azerty"
    Quand on remplace la lettre de position 4 par la lettre d'alphabet de position 1
    Alors le texte modifié est "abbazca"

Scénario: Remplacement aléatoire
    Soit un texte "abbacca"
    Et l'alphabet "qwerty"
    Quand on remplace aléatoirement une lettre
    Alors le texte a été changé par 2 modifications
