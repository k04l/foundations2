// src/features/profile/utils/dataProcessing.js

/**
 * Processes specializations data to ensure consistent format
 * Takes various input formats and returns a clean array of strings
 * 
 * @param {any} specializations - Raw specializations data (could be string, array, or JSON)
 * @returns {string[]} - Cleaned array of specialization strings
 */
export const processSpecializations = (specializations) => {
    // Handle empty or null input
    if (!specializations) {
        return [];
    }

    try {
        // If it's a string, try to parse it as JSON
        if (typeof specializations === 'string') {
            try {
                specializations = JSON.parse(specializations);
            } catch {
                // If parsing fails, treat it as a comma-separated string
                return specializations
                    .split(',')
                    .map(s => s.trim())
                    .filter(Boolean);
            }
        }

        // If it's already an array, clean it up
        if (Array.isArray(specializations)) {
            return specializations
                .reduce((acc, item) => {
                    // Handle nested arrays and JSON strings
                    if (typeof item === 'string') {
                        try {
                            const parsed = JSON.parse(item);
                            return acc.concat(Array.isArray(parsed) ? parsed : [item]);
                        } catch {
                            return acc.concat([item]);
                        }
                    }
                    return acc;
                }, [])
                .map(item => item.trim()) // Clean up whitespace
                .filter(Boolean)          // Remove empty strings
                .filter((item, index, self) => self.indexOf(item) === index); // Remove duplicates
        }

        return [];
    } catch (error) {
        console.error('Error processing specializations:', error);
        return [];
    }
};

/**
 * Processes certifications data to ensure consistent format
 * Takes various input formats and returns an object with a name array
 * 
 * @param {any} certifications - Raw certifications data
 * @returns {{ name: string[] }} - Cleaned certifications object
 */
export const processCertifications = (certifications) => {
    // Handle empty or null input
    if (!certifications) {
        return { name: [] };
    }

    try {
        // If it's a string, try to parse it as JSON
        if (typeof certifications === 'string') {
            try {
                certifications = JSON.parse(certifications);
            } catch {
                // If parsing fails, treat as single certification
                return { name: [certifications.trim()] };
            }
        }

        // If it's an object with a name property
        if (certifications?.name) {
            // Handle if name is a string
            if (typeof certifications.name === 'string') {
                return {
                    name: [certifications.name.trim()]
                };
            }
            // Handle if name is an array
            if (Array.isArray(certifications.name)) {
                return {
                    name: certifications.name
                        .map(cert => cert.trim())
                        .filter(Boolean)
                        .filter((cert, index, self) => self.indexOf(cert) === index)
                };
            }
        }

        // If it's an array, convert to proper format
        if (Array.isArray(certifications)) {
            return {
                name: certifications
                    .map(cert => cert.trim())
                    .filter(Boolean)
                    .filter((cert, index, self) => self.indexOf(cert) === index)
            };
        }

        return { name: [] };
    } catch (error) {
        console.error('Error processing certifications:', error);
        return { name: [] };
    }
};