Fonctionnalité: Mutations aléatoires

Scénario: Mutation par inversion de bit
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Et la distribution de mutations
        | nothing                        | 0 |
        | flip_random_bit_in_random_byte | 1 |
    Quand on applique au maximum 10 mutations aléatoires
    Alors le vecteur UInt8 est différent de
        | 1 | 2 | 3 |

Scénario: Mutation nulle
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Et la distribution de mutations
        | nothing                        | 1 |
        | flip_random_bit_in_random_byte | 0 |
    Quand on applique au maximum 10 mutations aléatoires
    Alors le vecteur UInt8 est
        | 1 | 2 | 3 |