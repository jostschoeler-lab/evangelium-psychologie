# Anleitung zum Beheben von Merge-Konflikten

Diese Anleitung beschreibt die wichtigsten Schritte, um Merge-Konflikte in diesem Projekt sicher zu lösen. Sie richtet sich an Personen, die wenig Erfahrung mit Git haben, und verwendet einfache Befehle, die direkt in der Konsole ausgeführt werden können.

## 1. Aktuellen Stand prüfen
Stellen Sie sicher, dass Sie sich im Projektverzeichnis befinden und der Branch sauber ist:

```bash
git status
```

Wenn Dateien als "unmerged" oder "both modified" angezeigt werden, gibt es einen Konflikt.

## 2. Konfliktstellen finden
Git markiert Konflikte mit `<<<<<<<`, `=======` und `>>>>>>>` in den betroffenen Dateien. Sie können alle Stellen mit folgendem Befehl auflisten:

```bash
rg "<<<<<<<"
```

Öffnen Sie jede Datei und entscheiden Sie, welche Änderungen beibehalten werden sollen. Entfernen Sie anschließend die Konflikt-Markierungen und passen Sie den Inhalt an.

## 3. Änderungen testen
Nachdem alle Konflikte inhaltlich geklärt sind, führen Sie die üblichen Prüfungen aus, zum Beispiel:

```bash
npm run build
```

Stellen Sie sicher, dass keine Fehler auftreten und die Anwendung weiterhin funktioniert.

## 4. Dateien als gelöst markieren
Sobald eine Datei bereinigt ist, markieren Sie sie als gelöst:

```bash
git add <dateiname>
```

Wenn alle Konflikte bearbeitet wurden, sollten im `git status` keine "unmerged files" mehr erscheinen.

## 5. Merge abschließen
Führen Sie den Merge-Commit zu Ende und prüfen Sie den Stand erneut:

```bash
git commit
git status
```

Bei laufenden Pull-Requests in GitHub sollten die Checks danach erneut starten und im Erfolgsfall grün werden.

## 6. Änderungen hochladen
Zum Schluss die Änderungen an den entfernten Branch übertragen:

```bash
git push
```

Damit ist der Merge abgeschlossen. Sollte weiterhin ein Konflikt bestehen, wiederholen Sie die Schritte 2–5 für die betroffenen Dateien.
