
type PouchDoc = {
    _id: string
    _rev?: string
    _attachments?: Record<string, {
        content_type: string
        data: string // base64
    }>
    [key: string]: any
}

export async function smartRestore(db: PouchDB.Database, docs: PouchDoc[]) {
    let imported = 0, updated = 0, skipped = 0

    for (const doc of docs) {
        try {
            const existing = await db.get(doc._id, { attachments: true })

            // Compare document contents (excluding _rev)
            const { _rev, ...existingData } = existing
            const { _rev: incomingRev, ...incomingData } = doc

            const changed = JSON.stringify(existingData) !== JSON.stringify(incomingData)

            if (changed) {
                const updatedDoc = { ...doc, _rev: existing._rev }
                await db.put(updatedDoc)
                updated++
            } else {
                skipped++
            }

        } catch (err: any) {
            if (err.status === 404) {
                await db.put(doc) // New doc
                imported++
            } else {
                console.error(`Error restoring ${doc._id}:`, err)
            }
        }
    }

    return { imported, updated, skipped }
}
