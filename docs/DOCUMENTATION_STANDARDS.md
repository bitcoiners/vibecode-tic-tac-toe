
## 📝 Command Documentation Standards

When documenting shell commands in markdown:

### Problem
Markdown code blocks (` `` `) can break prematurely when the command itself contains:
- Triple backticks
- Special characters
- Indented markers

### Solution
Use these techniques:

1. **Heredoc with Unique Delimiter**
   ```bash
   cat > file.txt << 'CMD_END'
   Content with ``` backticks
   CMD_END
   ```

2. **Escaped Backticks**
   ```bash
   echo '\`\`\`markdown' > file.md
   ```

3. **printf for Control**
   ```bash
   printf '%s\\n' \
     '```markdown' \
     'Content' \
     > file.md
   ```

4. **External Scripts** for complex procedures

### Validation
Always test commands after documentation:
```bash
# For JSON files
python3 -m json.tool file.json

# For scripts
bash -n script.sh
```

*Source: ai-memoria/pattern: markdown-command-formatting*
