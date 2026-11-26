#!/bin/bash
# Slowly pull auto-captions (json3, one track) for a list of video ids.
# Usage: tools/pull_captions.sh <idlist> <outdir>
# Skips ids that already have a .json3; backs off 10 / 30 / 60 min on 429.
YT=/Users/emir/Desktop/fretwise-repo/.venv/bin/yt-dlp
LIST="$1"; OUT="$2"; LOG="$OUT/_pull.log"
back=0; n=0; total=$(wc -l < "$LIST")
while read -r id; do
  [ -z "$id" ] && continue
  n=$((n+1))
  ls "$OUT/$id".*.json3 >/dev/null 2>&1 && continue
  for try in 1 2 3 4; do
    msg=$("$YT" --skip-download --write-auto-subs --write-subs --sub-langs "${LANGS:-en-orig}" --sub-format json3 \
          --sleep-subtitles 3 -P "$OUT" -o "%(id)s" -- "https://www.youtube.com/watch?v=$id" 2>&1)
    if ls "$OUT/$id".*.json3 >/dev/null 2>&1; then
      # keep one track only
      [ -f "$OUT/$id.en-orig.json3" ] && rm -f "$OUT/$id.en.json3"
      echo "$(date +%T) ok $n/$total $id" >> "$LOG"; back=0; break
    elif echo "$msg" | grep -q "429\|Too Many"; then
      back=$((back+1)); w=$((back==1?600:back==2?1800:3600))
      echo "$(date +%T) 429 on $id, waiting $((w/60)) min" >> "$LOG"; sleep $w
    else
      echo "$(date +%T) none $n/$total $id: $(echo "$msg" | grep -i 'error\|no sub\|There are no' | head -1)" >> "$LOG"; break
    fi
  done
  sleep $((8 + RANDOM % 18))
done < "$LIST"
echo "$(date +%T) DONE" >> "$LOG"
