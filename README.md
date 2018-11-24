# cactus-web
Projet sous WebGL + three.js

Nécessite les dossiers data et js, trouvable dans le dossier exemple WebGL/Three.js du professeur, sur Ametice.

Viewer de fichiers OBJ. Pour visualiser un fichier OBJ :

- Placer le fichier OBJ dans le dossier data.
- Changer le chemin du fichier dans le code (en dur), fichier viewMesh.html
- Profit !

Une fois le maillage chargé, affiche le nombre de faces et d'arêtes.

En utilisant le clic gauche de la souris sur une face, celle-ci se colore en vert. Elle est sélectionnée.
Si au moins deux faces ont été sélectionnées, application de l'algorithme A* (Path-Finding) permettant de
trouver le chemin le plus court entre deux faces (s'il existe un chemin de longueur inférieure ou égale à
une limite fixée en paramètre)

Lorsqu'un quatrième point du contour a été choisi, l'algorithme A* est appliquée une seconde fois, cette fois-ci
pour trouver le chemin entre ce point et le premier du contour.

Si l'utilisateur utilise le clic droit de la souris alors que des faces ont été sélectionnées (colorées en vert), ces
dernières ne le sont plus (couleur de la face revenue à la normale).

TO DO (si j'ai le temps :3) :

- Optimiser l'algo A* (au delà d'une certaine longueur de chemin (> 6 faces), explosion du nombre d'éléments dans les 
tableaux de la fonction A*, algorithme trop long à donner résultat, voire pire : boucle infinie)
- Colorer les faces se trouvant à l'intérieur du contour produit par l'algorithme A* (Parcours en profondeur ?)
- Entrer le nom du fichier à visualiser par le biais d'une fenêtre avant affichage
- ... etc.
