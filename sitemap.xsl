<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    exclude-result-prefixes="s xhtml">

    <xsl:output method="html" encoding="UTF-8" indent="yes" omit-xml-declaration="yes"/>

    <xsl:template match="/">
        <html lang="it">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <title>Sitemap XML</title>
                <style>
                    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
                        background: #0a0e1a; color: #f1f5f9; line-height: 1.6; margin: 0; padding: 2rem 1.25rem; }
                    .wrap { max-width: 720px; margin: 0 auto; }
                    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem; }
                    .note { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1.5rem; }
                    .note code { background: #1a1f35; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.88em; }
                    a { color: #f59e0b; }
                    a:hover { color: #d97706; }
                    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
                    th, td { text-align: left; padding: 0.65rem 0.75rem; border-bottom: 1px solid #1e293b; vertical-align: top; }
                    th { color: #94a3b8; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
                    .loc { word-break: break-all; }
                    ul.alt { margin: 0.25rem 0 0; padding-left: 1.1rem; color: #94a3b8; font-size: 0.85rem; }
                </style>
            </head>
            <body>
                <div class="wrap">
                    <h1>Sitemap</h1>
                    <p class="note">
                        Vista HTML generata da <code>sitemap.xsl</code> nel browser.
                        I motori di ricerca leggono l’XML di <code>sitemap.xml</code> senza questo foglio di stile.
                    </p>
                    <xsl:apply-templates select="s:urlset"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="s:urlset">
        <table>
            <thead>
                <tr>
                    <th>URL</th>
                    <th>Ultima modifica</th>
                    <th>Frequenza</th>
                    <th>Priorità</th>
                    <th>Alternate</th>
                </tr>
            </thead>
            <tbody>
                <xsl:for-each select="s:url">
                    <tr>
                        <td class="loc">
                            <a href="{s:loc}"><xsl:value-of select="s:loc"/></a>
                        </td>
                        <td><xsl:value-of select="s:lastmod"/></td>
                        <td><xsl:value-of select="s:changefreq"/></td>
                        <td><xsl:value-of select="s:priority"/></td>
                        <td>
                            <xsl:if test="xhtml:link">
                                <ul class="alt">
                                    <xsl:for-each select="xhtml:link">
                                        <li>
                                            <xsl:value-of select="@hreflang"/>: <xsl:value-of select="@href"/>
                                        </li>
                                    </xsl:for-each>
                                </ul>
                            </xsl:if>
                        </td>
                    </tr>
                </xsl:for-each>
            </tbody>
        </table>
    </xsl:template>
</xsl:stylesheet>
