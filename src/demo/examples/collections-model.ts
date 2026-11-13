export const TABLE_ROWS = [
  { id: 'r1', name: 'Amiya', atk: 512, def: 128, role: 'CASTER' },
  { id: 'r2', name: 'Kaltsit', atk: 480, def: 210, role: 'MEDIC' },
  { id: 'r3', name: 'Ifrit', atk: 620, def: 90, role: 'CASTER' },
  { id: 'r4', name: 'Saria', atk: 485, def: 590, role: 'DEFENDER' },
]

export function sortTableRows(key: 'name' | 'atk' | 'def', direction: 'ascending' | 'descending' | 'none') {
  if (direction === 'none') return TABLE_ROWS
  return [...TABLE_ROWS].sort((a, b) => {
    const left = a[key]
    const right = b[key]
    const difference = typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
    return direction === 'ascending' ? difference : -difference
  })
}

export function nextTableSort(currentKey: 'name' | 'atk' | 'def', direction: 'ascending' | 'descending' | 'none', key: 'name' | 'atk' | 'def') {
  return currentKey !== key ? 'descending' : direction === 'descending' ? 'ascending' : direction === 'ascending' ? 'none' : 'descending'
}
