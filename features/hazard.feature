Fonctionnalité: Mutations aléatoires

Scénario: Mutation par inversion de bit
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Et la distribution de mutations
        | nothing                        | 0 |
        | flip_random_bit_in_random_byte | 1 |
    Quand on applique au vecteur UInt8 au maximum 10 mutations aléatoires
    Alors le vecteur UInt8 est différent de
        | 1 | 2 | 3 |

Scénario: Mutation nulle
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Et la distribution de mutations
        | nothing                        | 1 |
        | flip_random_bit_in_random_byte | 0 |
    Quand on applique au vecteur UInt8 au maximum 10 mutations aléatoires
    Alors le vecteur UInt8 est
        | 1 | 2 | 3 |

Scénario: Mutation de texte
    Soit un texte "abbacca"
    Et la distribution de mutations
        | nothing                     | 1 |
        | replace_random_letter_latin | 1 |
    Quand on applique au texte au maximum 10 mutations aléatoires
    Alors le texte modifié est différent de "abbacca"
