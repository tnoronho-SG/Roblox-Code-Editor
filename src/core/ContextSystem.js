export class ContextSystem {
  static normalize(context) {
    if (!context) return 'both';
    const value = String(context).trim().toLowerCase();
    if (['server', 'client', 'shared', 'both'].includes(value)) return value;
    return 'both';
  }

  static isCompatible(currentContext, requiredContext) {
    const current = this.normalize(currentContext);
    const required = this.normalize(requiredContext);

    if (required === 'both' || required === 'shared') return true;
    if (current === 'both' || current === 'shared') return true;
    return current === required;
  }

  static validateBlockContext(block, currentContext = 'both') {
    const required = Array.isArray(block.contexts) ? block.contexts : [block.contexts || 'both'];
    const result = { valid: true, errors: [] };

    for (const item of required) {
      if (!this.isCompatible(currentContext, item)) {
        result.valid = false;
        result.errors.push({
          code: 'CONTEXT_MISMATCH',
          message: `This block requires a ${item} context and cannot run in ${currentContext}.`,
        });
      }
    }

    return result;
  }
}

export default ContextSystem;
