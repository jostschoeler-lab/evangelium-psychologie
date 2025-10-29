# Umgang mit neuen Bildern

Dieser Leitfaden fasst die nächsten Schritte zusammen, nachdem neue Bilder im Verzeichnis `public/images/` abgelegt wurden.

1. **Änderungen prüfen**  
   Kontrolliere mit `git status`, ob die neuen Dateien als Änderungen erkannt werden. Falls du versehentlich alte Dateien überschrieben hast, kannst du das hier ebenfalls sehen.

2. **Assets referenzieren**  
   Binde die neuen Bilder in deiner Anwendung ein, z. B. indem du sie in Komponenten oder Markdown-Inhalten verwendest. Typischerweise lautet der Importpfad `"/images/<dateiname>"` oder `new URL("./<dateiname>", import.meta.url).href`, abhängig davon, ob du sie im öffentlichen Ordner oder in `src/` verwendest.

3. **Git-Workflow ausführen**  
   Führe folgende Befehle in deinem Projektordner aus:

   ```bash
   git add public/images
   git commit -m "Füge neue Bilder hinzu"
   git push
   ```

   Dadurch landen die Bilder in deinem Remote-Repository.

4. **Deployment anstoßen**  
   Sobald die Änderungen auf GitHub liegen, startet das verbundene Deployment (z. B. Vercel) in der Regel automatisch. Prüfe anschließend die Live-Seite, ob die neuen Bilder korrekt angezeigt werden.

5. **Optional: Bereinigung**  
   Entferne nicht mehr benötigte Bilder aus `public/images/`, damit das Repository übersichtlich bleibt.

## Tipp
Falls du zusätzliche Verarbeitungsschritte (Optimierung, Responsive Images) brauchst, lohnt sich ein Blick auf Tools wie [Sharp](https://sharp.pixelplumbing.com/) oder spezialisierte Bild-CDNs. Diese können automatisiert eingebunden werden, sobald die Basisdateien im Repository vorliegen.
