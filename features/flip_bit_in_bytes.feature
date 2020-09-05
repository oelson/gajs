Fonctionnalité: Inversion de bit aléatoire dans vecteur UInt8 à une position aléatoire
    Attention l'indice des octets est LTR alors que l'indice des bits est RTL

Scénario: Inversion d'un bit de poid faible dans un vecteur UInt8
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Alors la représentation binaire du vecteur UInt8 est "000000010000001000000011"
    Quand j'inverse le bit de position 0 de l'octet de position 0
    Alors la représentation binaire du vecteur UInt8 est "000000000000001000000011"

Scénario: Inversion d'un bit médian dans un vecteur UInt8
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Alors la représentation binaire du vecteur UInt8 est "000000010000001000000011"
    Quand j'inverse le bit de position 4 de l'octet de position 1
    Alors la représentation binaire du vecteur UInt8 est "000000010001001000000011"

Scénario: Inversion d'un bit de poid fort dans un vecteur UInt8
    Soit un vecteur UInt8
        | 1 | 2 | 3 |
    Alors la représentation binaire du vecteur UInt8 est "000000010000001000000011"
    Quand j'inverse le bit de position 7 de l'octet de position 2
    Alors la représentation binaire du vecteur UInt8 est "000000010000001010000011"
