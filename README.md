# iop-bot
Simplistic Discord bot for game [Girl's Frontline]'s information

## Usage
### Keywords
The following keywords can be used interchangeably and hereby written as representive.

(소전): `소전` `소녀전선` **(Note: This works as bot's prefix.)**
  
(일반): `일반` `보통`

(중제): `중제` `중형` `중형제조`

(장비): `장비` `요정` (No difference for equipment and fairy)

### Time notation
You can write time as `h:mm`, `hmm` and also `h(%s) m(%s)` format.

### T-doll Timetable
- Unspecified type (default) `(소전) (인형)? %d`

Every possibilities regardless of craft type (normal/heavy) are printed.
T-dolls appearing only in heavycraft are marked as `(중)`.

- Normal `(소전) (일반) %d`

Can't craft shotguns. Several entries in timetable becomes nothing.

- Heavy `(소전) (중제) %d`

3 Stars are guaranteed. Doesn't produce handguns. Can craft shotguns.

### Equipment Timetable
`(소전) (장비) %d`

In fact you can't craft fairies in normalcraft, but it's not implemented since timetables are completely seperated.
