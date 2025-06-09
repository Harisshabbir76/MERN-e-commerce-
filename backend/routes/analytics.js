router.post('/search-tracking', async (req, res) => {
  try {
    const { eventType, query, metadata } = req.body;
    
    const entry = new Analytics({
      eventType: 'search_' + eventType, // search_query, search_results, etc.
      metadata: {
        query,
        ...metadata,
        ip: anonymizeIP(req.ip),
        userAgent: req.headers['user-agent']
      }
    });

    await entry.save();
    res.sendStatus(200);
  } catch (err) {
    console.error('Search tracking error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});