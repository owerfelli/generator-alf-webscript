
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;


import java.util.HashMap;
import java.util.Map;

public class <%- className %> extends DeclarativeWebScript {

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {

		Map<String, Object> model = new HashMap<String, Object>();
		model.put("data", "Facts and statistics collected together for reference or analysis.");
		return model;
	}
}
