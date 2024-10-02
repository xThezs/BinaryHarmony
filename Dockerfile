# Utiliser une image de base Nginx
FROM nginx:alpine

# Copier les fichiers du dossier dist dans le répertoire Nginx
COPY dist/binary-harmony/browser/ /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

