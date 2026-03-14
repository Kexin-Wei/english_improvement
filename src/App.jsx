import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen,
  FileText,
  PenTool,
  ArrowLeftRight,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Shuffle,
  Check,
  X,
  Copy,
  Search,
  Sparkles,
  Star,
  Loader2,
  Eye,
  EyeOff,
  Filter,
  BookMarked,
} from "lucide-react";

/* ═══════════════════════════════════════════
   DATA — VOCABULARY (100+ items)
   ═══════════════════════════════════════════ */

const VOCAB_DATA = [
  // AWL
  { word: "notwithstanding", pos: "prep/adv", def: "in spite of; nevertheless", example: "Notwithstanding the limitations of the dataset, the findings were statistically significant.", category: "AWL", family: "—" },
  { word: "albeit", pos: "conj", def: "although; even though", example: "The algorithm performed well, albeit with higher computational costs.", category: "AWL", family: "—" },
  { word: "delineate", pos: "verb", def: "to describe or indicate precisely; to outline", example: "The paper delineates the boundary conditions for the proposed framework.", category: "AWL", family: "delineation (n), delineated (adj)" },
  { word: "juxtapose", pos: "verb", def: "to place side by side for comparison or contrast", example: "We juxtapose the two threat models to highlight their divergent assumptions.", category: "AWL", family: "juxtaposition (n)" },
  { word: "paradigm", pos: "noun", def: "a typical example, model, or pattern of something", example: "This shift represents a new paradigm in network security architecture.", category: "AWL", family: "paradigmatic (adj), paradigmatically (adv)" },
  { word: "salient", pos: "adj", def: "most noticeable or important; prominent", example: "The salient features of the vulnerability are discussed in Section 3.", category: "AWL", family: "salience (n), saliently (adv)" },
  { word: "ubiquitous", pos: "adj", def: "present, appearing, or found everywhere", example: "Ubiquitous computing devices have expanded the attack surface considerably.", category: "AWL", family: "ubiquity (n), ubiquitously (adv)" },
  { word: "exacerbate", pos: "verb", def: "to make a problem or situation worse", example: "Legacy systems exacerbate the challenge of maintaining compliance.", category: "AWL", family: "exacerbation (n)" },
  { word: "ameliorate", pos: "verb", def: "to make something bad better; to improve", example: "The proposed patch ameliorates the race condition without degrading throughput.", category: "AWL", family: "amelioration (n), ameliorative (adj)" },
  { word: "corroborate", pos: "verb", def: "to confirm or support with evidence", example: "Our experimental results corroborate the theoretical predictions.", category: "AWL", family: "corroboration (n), corroborative (adj)" },
  { word: "elucidate", pos: "verb", def: "to make clear; to explain", example: "This section elucidates the underlying mechanism of the attack vector.", category: "AWL", family: "elucidation (n), elucidatory (adj)" },
  { word: "precipitate", pos: "verb", def: "to cause something to happen suddenly or prematurely", example: "A single misconfigured rule can precipitate a cascading failure.", category: "AWL", family: "precipitation (n), precipitous (adj)" },
  { word: "substantiate", pos: "verb", def: "to provide evidence to support or prove", example: "Further experiments are needed to substantiate these preliminary findings.", category: "AWL", family: "substantiation (n), substantive (adj)" },
  { word: "proliferate", pos: "verb", def: "to increase rapidly in number; to spread", example: "IoT devices have proliferated across healthcare environments.", category: "AWL", family: "proliferation (n), prolific (adj)" },
  { word: "circumvent", pos: "verb", def: "to find a way around an obstacle or restriction", example: "The attacker circumvented the firewall by exploiting a DNS rebinding flaw.", category: "AWL", family: "circumvention (n)" },
  { word: "postulate", pos: "verb", def: "to suggest or assume as a basis for reasoning", example: "We postulate that the observed latency stems from buffer contention.", category: "AWL", family: "postulation (n), postulate (n)" },
  { word: "supersede", pos: "verb", def: "to take the place of something previously used or accepted", example: "TLS 1.3 supersedes earlier versions by eliminating insecure cipher suites.", category: "AWL", family: "supersession (n)" },
  { word: "underpin", pos: "verb", def: "to form the basis or foundation of", example: "Cryptographic hash functions underpin the integrity guarantees of blockchain.", category: "AWL", family: "underpinning (n)" },
  { word: "underscore", pos: "verb", def: "to emphasize the importance of", example: "These breaches underscore the need for robust access control mechanisms.", category: "AWL", family: "—" },
  { word: "predicate", pos: "verb", def: "to found or base on; to assert", example: "The security model is predicated on the assumption of a trusted boot chain.", category: "AWL", family: "predicate (n), predication (n)" },
  { word: "disseminate", pos: "verb", def: "to spread information widely", example: "The findings were disseminated through peer-reviewed conferences.", category: "AWL", family: "dissemination (n)" },
  { word: "converge", pos: "verb", def: "to come together from different directions toward a common point", example: "Multiple lines of evidence converge on the same conclusion.", category: "AWL", family: "convergence (n), convergent (adj)" },
  { word: "diverge", pos: "verb", def: "to differ or deviate from a standard or expectation", example: "Our results diverge from prior work in two significant respects.", category: "AWL", family: "divergence (n), divergent (adj)" },
  { word: "aggregate", pos: "verb/noun", def: "to collect or combine into a whole", example: "We aggregate log data from multiple sensors for anomaly detection.", category: "AWL", family: "aggregation (n), aggregate (adj)" },
  { word: "mitigate", pos: "verb", def: "to make less severe, serious, or painful", example: "Hardware-based isolation can mitigate side-channel attacks.", category: "AWL", family: "mitigation (n), mitigating (adj)" },
  { word: "augment", pos: "verb", def: "to make greater by adding to it; to increase", example: "We augment the training corpus with synthetically generated samples.", category: "AWL", family: "augmentation (n)" },
  { word: "constrain", pos: "verb", def: "to restrict or limit", example: "Real-time requirements constrain the choice of encryption algorithms.", category: "AWL", family: "constraint (n), constrained (adj)" },
  { word: "facilitate", pos: "verb", def: "to make an action or process easier", example: "Containerization facilitates reproducible deployment across environments.", category: "AWL", family: "facilitation (n), facilitator (n)" },
  { word: "enumerate", pos: "verb", def: "to list or count one by one", example: "The scanner enumerates open ports and exposed services.", category: "AWL", family: "enumeration (n)" },
  { word: "extrapolate", pos: "verb", def: "to extend known data to predict unknown values", example: "We extrapolate from the observed trend to estimate future attack frequency.", category: "AWL", family: "extrapolation (n)" },
  { word: "interpolate", pos: "verb", def: "to insert values between known data points", example: "Missing timestamps are interpolated using adjacent entries.", category: "AWL", family: "interpolation (n)" },
  { word: "inherent", pos: "adj", def: "existing as a permanent, essential characteristic", example: "There is an inherent trade-off between security and usability.", category: "AWL", family: "inherently (adv), inhere (v)" },
  { word: "empirical", pos: "adj", def: "based on observation or experience rather than theory", example: "Empirical evaluation was conducted on three benchmark datasets.", category: "AWL", family: "empirically (adv), empiricism (n)" },
  { word: "analogous", pos: "adj", def: "comparable in certain respects; similar", example: "The process is analogous to key exchange in Diffie-Hellman.", category: "AWL", family: "analogy (n), analogously (adv)" },
  { word: "pertinent", pos: "adj", def: "relevant or applicable to a particular matter", example: "Only pertinent features are retained after dimensionality reduction.", category: "AWL", family: "pertinence (n), pertinently (adv)" },

  // COLLOCATIONS
  { word: "in light of", pos: "phrase", def: "taking into consideration; because of", example: "In light of recent breaches, the policy was updated.", category: "Collocations", family: "—" },
  { word: "with respect to", pos: "phrase", def: "in relation to; concerning", example: "With respect to latency, the new protocol outperforms its predecessor.", category: "Collocations", family: "—" },
  { word: "it is worth noting that", pos: "phrase", def: "used to draw attention to an important point", example: "It is worth noting that the sample size was limited to 50 participants.", category: "Collocations", family: "—" },
  { word: "a growing body of evidence", pos: "phrase", def: "an increasing amount of research or data", example: "A growing body of evidence suggests that static analysis alone is insufficient.", category: "Collocations", family: "—" },
  { word: "lends credence to", pos: "phrase", def: "supports the believability of", example: "This finding lends credence to the hypothesis of insider threat involvement.", category: "Collocations", family: "—" },
  { word: "in conjunction with", pos: "phrase", def: "together with; in combination with", example: "The IDS operates in conjunction with a host-based firewall.", category: "Collocations", family: "—" },
  { word: "to a large extent", pos: "phrase", def: "mostly; for the most part", example: "The system's resilience depends to a large extent on redundancy.", category: "Collocations", family: "—" },
  { word: "on the grounds that", pos: "phrase", def: "for the reason that", example: "The proposal was rejected on the grounds that it lacked empirical validation.", category: "Collocations", family: "—" },
  { word: "give rise to", pos: "phrase", def: "to cause or produce", example: "Improper input validation can give rise to injection vulnerabilities.", category: "Collocations", family: "—" },
  { word: "by virtue of", pos: "phrase", def: "because of; by means of", example: "By virtue of its architecture, the system resists single points of failure.", category: "Collocations", family: "—" },
  { word: "insofar as", pos: "phrase", def: "to the extent that", example: "The model is valid insofar as the assumptions hold in practice.", category: "Collocations", family: "—" },
  { word: "for the sake of", pos: "phrase", def: "in order to achieve or preserve", example: "For the sake of clarity, we present the algorithm in pseudocode.", category: "Collocations", family: "—" },
  { word: "on the basis of", pos: "phrase", def: "according to; using as a foundation", example: "Access is granted on the basis of role-based permissions.", category: "Collocations", family: "—" },
  { word: "in the absence of", pos: "phrase", def: "without; when something is lacking", example: "In the absence of ground truth, we rely on proxy metrics.", category: "Collocations", family: "—" },
  { word: "with a view to", pos: "phrase", def: "with the aim or intention of", example: "The framework was designed with a view to extensibility.", category: "Collocations", family: "—" },
  { word: "at the expense of", pos: "phrase", def: "sacrificing or losing something else", example: "Higher accuracy was achieved at the expense of computational efficiency.", category: "Collocations", family: "—" },
  { word: "lend itself to", pos: "phrase", def: "be suitable for; be adaptable to", example: "The modular architecture lends itself to incremental deployment.", category: "Collocations", family: "—" },
  { word: "shed light on", pos: "phrase", def: "to clarify or reveal information about", example: "The case study sheds light on the root cause of the outage.", category: "Collocations", family: "—" },
  { word: "draw upon", pos: "phrase", def: "to use as a resource or basis", example: "We draw upon prior taxonomies to classify the observed threats.", category: "Collocations", family: "—" },
  { word: "account for", pos: "phrase", def: "to explain; to constitute a proportion of", example: "Misconfiguration errors account for over 40% of reported incidents.", category: "Collocations", family: "—" },

  // GENERAL (10k-40k range)
  { word: "commensurate", pos: "adj", def: "corresponding in size, extent, or degree; proportional", example: "The budget allocation should be commensurate with the risk level.", category: "General", family: "commensurately (adv)" },
  { word: "perfunctory", pos: "adj", def: "carried out with minimal effort; superficial", example: "A perfunctory code review failed to catch the buffer overflow.", category: "General", family: "perfunctorily (adv), perfunctoriness (n)" },
  { word: "ostensible", pos: "adj", def: "stated or appearing to be true, but not necessarily so", example: "The ostensible purpose of the update was performance optimization.", category: "General", family: "ostensibly (adv)" },
  { word: "impinge", pos: "verb", def: "to have an effect, especially a negative one; to encroach", example: "Excessive logging can impinge on system performance.", category: "General", family: "impingement (n)" },
  { word: "preclude", pos: "verb", def: "to prevent from happening; to make impossible", example: "The architecture precludes unauthorized lateral movement.", category: "General", family: "preclusion (n), preclusive (adj)" },
  { word: "contingent upon", pos: "phrase", def: "dependent on; conditional on", example: "Deployment is contingent upon successful penetration testing.", category: "General", family: "contingency (n), contingently (adv)" },
  { word: "tantamount", pos: "adj", def: "equivalent in seriousness or effect", example: "Ignoring patch management is tantamount to inviting a breach.", category: "General", family: "—" },
  { word: "efficacious", pos: "adj", def: "successful in producing a desired result; effective", example: "The countermeasure proved efficacious against side-channel attacks.", category: "General", family: "efficacy (n), efficaciously (adv)" },
  { word: "recalcitrant", pos: "adj", def: "stubbornly uncooperative; resistant to authority", example: "Recalcitrant legacy systems resist integration with modern APIs.", category: "General", family: "recalcitrance (n)" },
  { word: "concomitant", pos: "adj", def: "naturally accompanying or associated with", example: "Increased connectivity brings concomitant security challenges.", category: "General", family: "concomitantly (adv), concomitance (n)" },
  { word: "obviate", pos: "verb", def: "to remove or prevent (a difficulty); to make unnecessary", example: "End-to-end encryption obviates the need for trusted intermediaries.", category: "General", family: "obviation (n)" },
  { word: "abrogate", pos: "verb", def: "to repeal or do away with formally", example: "The new standard abrogates the deprecated cipher suites.", category: "General", family: "abrogation (n)" },
  { word: "promulgate", pos: "verb", def: "to make widely known; to put into effect formally", example: "NIST promulgated updated guidelines for post-quantum cryptography.", category: "General", family: "promulgation (n)" },
  { word: "relegate", pos: "verb", def: "to assign to a lower position or less important status", example: "Performance testing was relegated to an afterthought.", category: "General", family: "relegation (n)" },
  { word: "coalesce", pos: "verb", def: "to come together to form a whole", example: "Disparate data streams coalesce into a unified threat intelligence feed.", category: "General", family: "coalescence (n), coalescent (adj)" },
  { word: "supplant", pos: "verb", def: "to take the place of; to supersede", example: "Cloud-native architectures are gradually supplanting on-premises solutions.", category: "General", family: "supplantation (n)" },
  { word: "confound", pos: "verb", def: "to cause surprise or confusion; to mix up", example: "Polymorphic malware confounds signature-based detection.", category: "General", family: "confounding (adj), confoundingly (adv)" },
  { word: "engender", pos: "verb", def: "to cause or give rise to", example: "Data breaches engender distrust among users.", category: "General", family: "—" },
  { word: "attenuate", pos: "verb", def: "to reduce the force, effect, or value of", example: "Defense-in-depth strategies attenuate the impact of individual failures.", category: "General", family: "attenuation (n)" },
  { word: "obfuscate", pos: "verb", def: "to make unclear or difficult to understand", example: "Code obfuscation obfuscates control flow to hinder reverse engineering.", category: "General", family: "obfuscation (n)" },
  { word: "nascent", pos: "adj", def: "just beginning to develop; emerging", example: "Nascent quantum computing capabilities pose long-term cryptographic risks.", category: "General", family: "nascence (n)" },
  { word: "pervasive", pos: "adj", def: "spreading widely throughout an area or group", example: "Pervasive monitoring raises significant privacy concerns.", category: "General", family: "pervasively (adv), pervasiveness (n)" },
  { word: "egregious", pos: "adj", def: "outstandingly bad; shocking", example: "The egregious mishandling of credentials led to a major breach.", category: "General", family: "egregiously (adv), egregiousness (n)" },
  { word: "cogent", pos: "adj", def: "clear, logical, and convincing", example: "The paper presents a cogent argument for zero-trust architecture.", category: "General", family: "cogency (n), cogently (adv)" },
  { word: "spurious", pos: "adj", def: "not genuine; false or fake", example: "The model must distinguish spurious correlations from causal relationships.", category: "General", family: "spuriously (adv), spuriousness (n)" },
  { word: "pernicious", pos: "adj", def: "having a harmful effect, especially gradually", example: "Shadow IT has a pernicious effect on organizational security posture.", category: "General", family: "perniciously (adv), perniciousness (n)" },
  { word: "amenable", pos: "adj", def: "open and responsive; willing to comply", example: "The protocol is amenable to formal verification.", category: "General", family: "amenability (n), amenably (adv)" },
  { word: "tractable", pos: "adj", def: "easy to deal with or control; manageable", example: "We reduce the problem to a tractable optimization formulation.", category: "General", family: "tractability (n), intractable (adj)" },
  { word: "tenable", pos: "adj", def: "able to be maintained or defended against objection", example: "The assumption of a passive adversary is no longer tenable.", category: "General", family: "tenability (n), untenable (adj)" },
  { word: "deleterious", pos: "adj", def: "causing harm or damage", example: "Unchecked memory allocations have deleterious effects on stability.", category: "General", family: "deleteriously (adv)" },
  { word: "inexorable", pos: "adj", def: "impossible to stop or prevent; relentless", example: "The inexorable growth of attack surfaces demands adaptive defenses.", category: "General", family: "inexorably (adv), inexorability (n)" },
  { word: "propensity", pos: "noun", def: "an inclination or natural tendency to behave in a certain way", example: "Systems with high complexity exhibit a propensity for configuration drift.", category: "General", family: "—" },
  { word: "veracity", pos: "noun", def: "conformity to facts; accuracy; truthfulness", example: "The veracity of log entries must be ensured through tamper-evident storage.", category: "General", family: "veracious (adj)" },
  { word: "acumen", pos: "noun", def: "the ability to make good judgments and quick decisions", example: "Technical acumen alone is insufficient without security awareness.", category: "General", family: "—" },
  { word: "vagary", pos: "noun", def: "an unexpected and inexplicable change; a wandering", example: "The vagaries of network latency complicate real-time detection.", category: "General", family: "vagaries (pl)" },
  { word: "equivocal", pos: "adj", def: "open to more than one interpretation; ambiguous", example: "The equivocal results necessitate further investigation.", category: "General", family: "equivocally (adv), equivocate (v)" },
  { word: "repudiate", pos: "verb", def: "to refuse to accept or be associated with; to deny", example: "The vendor repudiated responsibility for the firmware vulnerability.", category: "General", family: "repudiation (n)" },
  { word: "conflate", pos: "verb", def: "to combine two or more ideas into one, often mistakenly", example: "It is important not to conflate correlation with causation.", category: "General", family: "conflation (n)" },
  { word: "demarcate", pos: "verb", def: "to set the boundaries or limits of", example: "Network segmentation demarcates trust zones within the infrastructure.", category: "AWL", family: "demarcation (n)" },
  { word: "bifurcate", pos: "verb", def: "to divide into two branches or parts", example: "The data pipeline bifurcates at the ingestion layer for parallel processing.", category: "General", family: "bifurcation (n)" },
  { word: "congruent", pos: "adj", def: "in agreement or harmony; corresponding", example: "The experimental outcomes are congruent with the theoretical model.", category: "AWL", family: "congruence (n), congruently (adv)" },
  { word: "antithetical", pos: "adj", def: "directly opposed or contrasted; mutually incompatible", example: "Open access and strict IP control are often antithetical goals.", category: "General", family: "antithesis (n), antithetically (adv)" },
  { word: "predispose", pos: "verb", def: "to make someone liable or inclined to a specified outcome", example: "Weak default configurations predispose systems to exploitation.", category: "AWL", family: "predisposition (n)" },
  { word: "epitomize", pos: "verb", def: "to be a perfect example of a quality or type", example: "The SolarWinds incident epitomizes supply chain compromise at scale.", category: "General", family: "epitome (n)" },
  { word: "subsume", pos: "verb", def: "to include or absorb into something larger", example: "The new framework subsumes prior vulnerability classification schemes.", category: "AWL", family: "subsumption (n)" },
  { word: "in tandem with", pos: "phrase", def: "together with; alongside", example: "The IDS operates in tandem with real-time log correlation.", category: "Collocations", family: "—" },
  { word: "to that end", pos: "phrase", def: "for that purpose; with that goal in mind", example: "To that end, we implemented a custom fuzzing harness.", category: "Collocations", family: "—" },
  { word: "pursuant to", pos: "phrase", def: "in accordance with; following", example: "Pursuant to the disclosure policy, the vendor was notified 90 days prior.", category: "Collocations", family: "—" },
];

/* ═══════════════════════════════════════════
   DATA — PHRASEBANK (80+ entries)
   ═══════════════════════════════════════════ */

const PHRASEBANK_DATA = {
  "Introducing a topic": [
    { phrase: "This paper examines…", example: "This paper examines the efficacy of machine learning–based intrusion detection in IoT networks." },
    { phrase: "The present study investigates…", example: "The present study investigates the correlation between firmware update frequency and vulnerability exposure." },
    { phrase: "The aim of this research is to…", example: "The aim of this research is to develop a lightweight authentication protocol for resource-constrained devices." },
    { phrase: "This work addresses the problem of…", example: "This work addresses the problem of scalable key management in distributed sensor networks." },
    { phrase: "In recent years, there has been growing interest in…", example: "In recent years, there has been growing interest in adversarial machine learning." },
    { phrase: "The purpose of this study is to…", example: "The purpose of this study is to evaluate the resilience of post-quantum signature schemes." },
    { phrase: "This paper presents a novel approach to…", example: "This paper presents a novel approach to automated vulnerability triage using large language models." },
    { phrase: "We seek to answer the following research question:…", example: "We seek to answer the following research question: How does network segmentation affect lateral movement time?" },
  ],
  "Reviewing literature": [
    { phrase: "Previous studies have demonstrated that…", example: "Previous studies have demonstrated that static analysis tools miss approximately 30% of injection flaws." },
    { phrase: "Several researchers have addressed…", example: "Several researchers have addressed the challenge of real-time malware classification." },
    { phrase: "There is a substantial body of literature on…", example: "There is a substantial body of literature on formal methods for protocol verification." },
    { phrase: "While much attention has been paid to…, less is known about…", example: "While much attention has been paid to network-level defenses, less is known about firmware integrity verification." },
    { phrase: "A number of studies have reported…", example: "A number of studies have reported elevated false positive rates in behavioral anomaly detection." },
    { phrase: "The existing literature suggests…", example: "The existing literature suggests that human factors remain the weakest link in security." },
    { phrase: "To date, few studies have examined…", example: "To date, few studies have examined the impact of supply chain compromises on medical device software." },
    { phrase: "Building on the work of [Author], we…", example: "Building on the work of Anderson et al., we extend the threat model to include insider adversaries." },
  ],
  "Describing methodology": [
    { phrase: "The methodology adopted for this study…", example: "The methodology adopted for this study combines static analysis with dynamic taint tracking." },
    { phrase: "Data were collected through…", example: "Data were collected through network packet captures over a 30-day observation period." },
    { phrase: "A mixed-methods approach was employed…", example: "A mixed-methods approach was employed, combining quantitative log analysis with qualitative interviews." },
    { phrase: "The experiment was conducted under controlled conditions…", example: "The experiment was conducted under controlled conditions using an isolated virtual network." },
    { phrase: "Participants were randomly assigned to…", example: "Participants were randomly assigned to either the phishing-aware or control group." },
    { phrase: "To ensure validity, we…", example: "To ensure validity, we repeated each trial five times and report the median." },
    { phrase: "The following steps were undertaken:…", example: "The following steps were undertaken: vulnerability scanning, manual verification, and risk scoring." },
    { phrase: "We operationalize [concept] as…", example: "We operationalize 'security maturity' as the composite score across five NIST CSF categories." },
  ],
  "Reporting results": [
    { phrase: "The results indicate that…", example: "The results indicate that the proposed method reduces false positives by 38%." },
    { phrase: "As shown in Table X,…", example: "As shown in Table 3, latency increases linearly with the number of encryption layers." },
    { phrase: "A statistically significant difference was found…", example: "A statistically significant difference was found between the two groups (p < 0.01)." },
    { phrase: "The data reveal a clear trend toward…", example: "The data reveal a clear trend toward earlier detection when behavioral analytics are deployed." },
    { phrase: "Contrary to expectations,…", example: "Contrary to expectations, the lightweight cipher outperformed AES-256 in throughput." },
    { phrase: "The most striking finding is…", example: "The most striking finding is the 5× improvement in detection latency." },
    { phrase: "No significant correlation was observed between…", example: "No significant correlation was observed between code complexity and vulnerability density." },
    { phrase: "Figure X illustrates…", example: "Figure 4 illustrates the relationship between payload size and processing time." },
  ],
  "Discussing implications": [
    { phrase: "These findings suggest that…", example: "These findings suggest that current patching cadences are insufficient for zero-day threats." },
    { phrase: "The implications of this study are twofold:…", example: "The implications of this study are twofold: first, for policy makers; second, for practitioners." },
    { phrase: "This has important implications for…", example: "This has important implications for the design of safety-critical medical device firmware." },
    { phrase: "From a practical standpoint,…", example: "From a practical standpoint, the reduced overhead makes deployment feasible on edge devices." },
    { phrase: "One possible explanation for this is…", example: "One possible explanation for this is that the adversary adapts to static defense configurations." },
    { phrase: "It is plausible that…", example: "It is plausible that the performance gains are attributable to hardware acceleration." },
    { phrase: "These results have far-reaching consequences for…", example: "These results have far-reaching consequences for regulatory compliance in healthcare IT." },
    { phrase: "The broader significance of these findings lies in…", example: "The broader significance of these findings lies in their applicability to other constrained environments." },
  ],
  "Comparing and contrasting": [
    { phrase: "In contrast to…, the present study…", example: "In contrast to previous work, the present study accounts for adversarial adaptation." },
    { phrase: "Unlike [X], our approach…", example: "Unlike signature-based methods, our approach generalizes to unseen attack patterns." },
    { phrase: "Similarly, [Author] found that…", example: "Similarly, Kim et al. found that network segmentation reduced breach propagation time." },
    { phrase: "Both [X] and [Y] share the characteristic of…", example: "Both protocols share the characteristic of forward secrecy." },
    { phrase: "While [X] emphasizes…, [Y] prioritizes…", example: "While TLS focuses on transport security, IPsec prioritizes network-layer protection." },
    { phrase: "A key distinction between [X] and [Y] is…", example: "A key distinction between the two frameworks is their handling of key revocation." },
    { phrase: "The former… whereas the latter…", example: "The former relies on symmetric encryption, whereas the latter employs asymmetric primitives." },
    { phrase: "On the one hand,… On the other hand,…", example: "On the one hand, centralized logging simplifies monitoring. On the other hand, it creates a single point of failure." },
  ],
  "Hedging and caution": [
    { phrase: "It appears that…", example: "It appears that the anomaly is triggered by a specific sequence of API calls." },
    { phrase: "This may be attributable to…", example: "This may be attributable to the limited diversity of the training data." },
    { phrase: "The evidence tentatively suggests…", example: "The evidence tentatively suggests a link between patch delay and exploit availability." },
    { phrase: "It is possible that…", example: "It is possible that environmental factors influenced the observed latency variations." },
    { phrase: "Care should be taken when interpreting…", example: "Care should be taken when interpreting results from synthetic datasets." },
    { phrase: "These results should be interpreted with caution due to…", example: "These results should be interpreted with caution due to the small sample size." },
    { phrase: "It would be premature to conclude that…", example: "It would be premature to conclude that the approach scales to enterprise-grade deployments." },
    { phrase: "A degree of uncertainty remains regarding…", example: "A degree of uncertainty remains regarding the generalizability of these findings." },
  ],
  "Stating limitations": [
    { phrase: "This study is not without limitations.…", example: "This study is not without limitations. The dataset was drawn from a single organization." },
    { phrase: "A limitation of this approach is…", example: "A limitation of this approach is its reliance on labeled training data." },
    { phrase: "The scope of this study was confined to…", example: "The scope of this study was confined to web application vulnerabilities." },
    { phrase: "Due to [constraint], we were unable to…", example: "Due to ethical constraints, we were unable to test on live production systems." },
    { phrase: "Future work should address…", example: "Future work should address the scalability of the proposed solution." },
    { phrase: "It should be noted that…", example: "It should be noted that the evaluation was performed in a controlled lab environment." },
    { phrase: "One potential weakness of this study is…", example: "One potential weakness of this study is the absence of adversarial evaluation." },
    { phrase: "Generalizability may be limited because…", example: "Generalizability may be limited because the experiments used only one operating system." },
  ],
  "Concluding": [
    { phrase: "In conclusion, this study has shown that…", example: "In conclusion, this study has shown that automated fuzzing significantly improves coverage." },
    { phrase: "Taken together, the findings suggest…", example: "Taken together, the findings suggest a paradigm shift toward proactive threat hunting." },
    { phrase: "The present study contributes to the field by…", example: "The present study contributes to the field by proposing a novel metric for firmware security." },
    { phrase: "This research opens avenues for…", example: "This research opens avenues for applying differential privacy to medical device telemetry." },
    { phrase: "To summarize, the key contributions of this work are…", example: "To summarize, the key contributions of this work are threefold." },
    { phrase: "In sum, our analysis demonstrates…", example: "In sum, our analysis demonstrates the viability of homomorphic encryption for health data." },
    { phrase: "We conclude by noting that…", example: "We conclude by noting that no single defense mechanism is sufficient in isolation." },
    { phrase: "The overarching conclusion is that…", example: "The overarching conclusion is that defense-in-depth remains the most robust strategy." },
  ],
  "Transitioning": [
    { phrase: "Having established X, we now turn to…", example: "Having established the threat model, we now turn to the proposed countermeasures." },
    { phrase: "Before proceeding to…, it is necessary to…", example: "Before proceeding to the evaluation, it is necessary to define the baseline metrics." },
    { phrase: "The following section elaborates on…", example: "The following section elaborates on the experimental setup and data collection." },
    { phrase: "With this in mind,…", example: "With this in mind, we designed the protocol to minimize handshake overhead." },
    { phrase: "Building on the preceding discussion,…", example: "Building on the preceding discussion, we now formalize the security properties." },
    { phrase: "As noted above,…", example: "As noted above, the attack requires physical access to the device." },
    { phrase: "To this end,…", example: "To this end, we implemented a proof-of-concept scanner." },
    { phrase: "Against this backdrop,…", example: "Against this backdrop, the need for automated compliance checking becomes evident." },
  ],
};

/* ═══════════════════════════════════════════
   DATA — REWRITE EXERCISES (20+)
   ═══════════════════════════════════════════ */

const REWRITE_DATA = [
  { casual: "We found that the system has some problems.", model: "Several critical vulnerabilities were identified during the assessment." },
  { casual: "The results were pretty good.", model: "The results demonstrated a statistically significant improvement over the baseline." },
  { casual: "This thing is really important for security.", model: "This mechanism constitutes a critical component of the security architecture." },
  { casual: "We used a bunch of different tools to test it.", model: "A comprehensive suite of testing tools was employed to evaluate system resilience." },
  { casual: "Nobody has really looked at this before.", model: "This area remains largely unexplored in the existing literature." },
  { casual: "The old system was really slow and didn't work well.", model: "The legacy system exhibited substantial performance degradation and functional limitations." },
  { casual: "We think this might fix the problem.", model: "The proposed solution is anticipated to remediate the identified vulnerability." },
  { casual: "Lots of people use this kind of software.", model: "This category of software has achieved widespread adoption across diverse sectors." },
  { casual: "The attack works by messing with the input data.", model: "The attack vector exploits insufficient input validation to inject malicious payloads." },
  { casual: "We need to make the system safer.", model: "Enhancing the security posture of the system is imperative to mitigate emerging threats." },
  { casual: "The test showed that our idea works.", model: "The experimental results validate the efficacy of the proposed approach." },
  { casual: "This paper talks about how to protect medical devices.", model: "This paper presents a framework for safeguarding medical device firmware integrity." },
  { casual: "We compared our method with other ones and ours is better.", model: "A comparative analysis demonstrates the superiority of the proposed method across all evaluated metrics." },
  { casual: "The problem keeps getting worse over time.", model: "The issue exhibits a progressive deterioration that demands timely intervention." },
  { casual: "We can't be totally sure about these results.", model: "These findings should be interpreted with appropriate caution given the inherent limitations." },
  { casual: "This could be useful in real life.", model: "The practical applicability of this approach extends to operational environments." },
  { casual: "The data shows that more people are getting hacked.", model: "The data indicate an upward trend in the frequency of successful cyber intrusions." },
  { casual: "We looked at what other people have done.", model: "A comprehensive review of prior work was conducted to establish the current state of knowledge." },
  { casual: "The main point of this study is to figure out why systems fail.", model: "The primary objective of this study is to elucidate the root causes of system failures." },
  { casual: "It's hard to keep up with all the new threats.", model: "The rapidly evolving threat landscape poses significant challenges for maintaining defensive readiness." },
  { casual: "We built a tool that finds bugs automatically.", model: "We developed an automated static analysis tool capable of detecting software defects without manual intervention." },
  { casual: "This doesn't work on all types of networks.", model: "The applicability of this approach is constrained to specific network topologies." },
  { casual: "More research needs to be done on this topic.", model: "Further investigation is warranted to fully characterize the scope of this phenomenon." },
];

/* ═══════════════════════════════════════════
   DATA — COMPARISON PAIRS (20+)
   ═══════════════════════════════════════════ */

const COMPARE_DATA = {
  "Informal → Formal verbs": [
    { casual: "get", academic: "obtain / acquire", note: "Replace vague 'get' with precise verbs indicating the manner of acquisition." },
    { casual: "show", academic: "demonstrate / illustrate / indicate", note: "Academic writing prefers verbs that convey the strength of the evidence." },
    { casual: "use", academic: "employ / utilize / leverage", note: "'Employ' for methods, 'utilize' for making use of something not originally intended, 'leverage' for strategic advantage." },
    { casual: "help", academic: "facilitate / enable / assist", note: "'Facilitate' implies making a process easier; 'enable' implies making it possible." },
    { casual: "make", academic: "construct / generate / produce", note: "Choose based on context: 'construct' for building, 'generate' for creating output, 'produce' for yielding results." },
  ],
  "Spoken → Written phrasing": [
    { casual: "a lot of", academic: "a substantial number of / considerable / numerous", note: "Quantify when possible ('a 40% increase') or use precise qualifiers." },
    { casual: "really important", academic: "of paramount importance / critical / essential", note: "Avoid intensifiers like 'really' and 'very' — choose inherently strong words." },
    { casual: "kind of / sort of", academic: "to some extent / somewhat / to a degree", note: "Hedging is acceptable in academic writing but should be precise, not colloquial." },
    { casual: "stuff / things", academic: "factors / variables / components / elements", note: "Always replace vague nouns with domain-specific terms." },
    { casual: "a couple of", academic: "two / several / a limited number of", note: "Be numerically precise whenever the data allows." },
  ],
  "Vague → Precise": [
    { casual: "big problem", academic: "significant challenge / critical vulnerability", note: "Specify the nature and severity of the problem." },
    { casual: "does well", academic: "performs effectively / achieves high accuracy", note: "Replace subjective assessment with measurable criteria." },
    { casual: "bad results", academic: "suboptimal outcomes / degraded performance", note: "Characterize the nature of the deficiency precisely." },
    { casual: "new method", academic: "novel approach / proposed methodology", note: "'Novel' implies originality; 'proposed' signals it's your contribution." },
  ],
  "Personal → Impersonal": [
    { casual: "I think", academic: "It can be argued that / Evidence suggests", note: "Shift authority from personal opinion to evidence or logical reasoning." },
    { casual: "We found out", academic: "It was determined that / Analysis revealed", note: "Passive voice or nominalization removes the personal subject." },
    { casual: "In my opinion", academic: "From the perspective of / The analysis indicates", note: "Ground claims in methodology, not personal belief." },
  ],
  "Phrasal verbs → Formal verbs": [
    { casual: "come up with", academic: "devise / formulate / propose", note: "Single formal verbs are more concise and precise than multi-word phrases." },
    { casual: "look into", academic: "investigate / examine / explore", note: "Choose based on depth: 'examine' > 'explore' > 'look into'." },
    { casual: "find out", academic: "determine / ascertain / establish", note: "'Determine' for conclusions, 'ascertain' for verification, 'establish' for proof." },
    { casual: "point out", academic: "highlight / emphasize / note", note: "'Highlight' draws attention, 'emphasize' stresses importance, 'note' is neutral." },
    { casual: "carry out", academic: "conduct / execute / perform", note: "'Conduct' for studies, 'execute' for procedures, 'perform' for actions." },
    { casual: "set up", academic: "establish / configure / initialize", note: "Technical writing benefits from domain-specific verbs." },
    { casual: "go up / go down", academic: "increase / decrease / escalate / diminish", note: "Use verbs that convey rate and direction precisely." },
    { casual: "break down", academic: "decompose / analyze / categorize", note: "Choose based on whether you're dividing, studying, or classifying." },
  ],
};

/* ═══════════════════════════════════════════
   DATA — GRAMMAR L1 TRANSFER ERRORS (15+)
   ═══════════════════════════════════════════ */

const GRAMMAR_DATA = {
  "Article usage (a/an/the/∅)": [
    { error: "We propose method to detect malware.", correction: "We propose a method to detect malware.", explanation: "Mandarin lacks articles. Countable singular nouns in English require an article (a/an/the) or determiner." },
    { error: "The result shows that accuracy is high.", correction: "The results show that the accuracy is high.", explanation: "'Results' should be plural when referring to multiple outcomes; 'accuracy' needs 'the' when referring to a specific measured value." },
    { error: "In future, we will extend this work.", correction: "In the future, we will extend this work.", explanation: "The fixed phrase is 'in the future.' The article 'the' is required in this prepositional phrase." },
    { error: "System was tested under different condition.", correction: "The system was tested under different conditions.", explanation: "Specific systems need 'the'; 'condition' must be pluralized when 'different' implies multiple." },
  ],
  "Singular/plural agreement": [
    { error: "The researches show that…", correction: "The research shows that… / The studies show that…", explanation: "'Research' is uncountable in English (unlike 研究 in Chinese which can be pluralized). Use 'studies' if you need a countable form." },
    { error: "We collected many informations.", correction: "We collected a great deal of information.", explanation: "'Information' is an uncountable noun. Use 'a great deal of' or 'much' instead of 'many'." },
    { error: "These equipments are expensive.", correction: "This equipment is expensive. / These devices are expensive.", explanation: "'Equipment' is uncountable. For countable alternatives, use 'devices,' 'instruments,' or 'tools'." },
  ],
  "Tense consistency": [
    { error: "We analyzed the data and find that the result is significant.", correction: "We analyzed the data and found that the results were significant.", explanation: "Maintain past tense throughout when describing completed research actions." },
    { error: "The experiment is conducted last month.", correction: "The experiment was conducted last month.", explanation: "Past time markers ('last month') require past tense, not present." },
    { error: "In Section 3, we discussed the methodology. The results are presented in Section 4.", correction: "In Section 3, we discuss the methodology. The results are presented in Section 4.", explanation: "When referring to sections of the current paper, use present tense consistently ('discuss,' 'present')." },
  ],
  "Preposition choice": [
    { error: "We discuss about the implications.", correction: "We discuss the implications.", explanation: "'Discuss' is transitive in English — it takes a direct object without 'about' (unlike 讨论关于)." },
    { error: "The system is composed by three modules.", correction: "The system is composed of three modules.", explanation: "The correct collocation is 'composed of' (not 'composed by')." },
    { error: "According to my opinion…", correction: "In my opinion… / From my perspective…", explanation: "'According to' cites an external source, not oneself. Use 'in my opinion' for personal views." },
    { error: "The result is different with the baseline.", correction: "The result is different from the baseline.", explanation: "'Different from' is standard in English (not 'different with,' calqued from 和…不同)." },
  ],
  "Run-on sentences": [
    { error: "The system detected the anomaly it then triggered an alert.", correction: "The system detected the anomaly and subsequently triggered an alert.", explanation: "Two independent clauses need a conjunction, semicolon, or period — not just juxtaposition." },
    { error: "We tested the prototype, the results were promising.", correction: "We tested the prototype, and the results were promising. / We tested the prototype; the results were promising.", explanation: "A comma alone cannot join two independent clauses (comma splice). Add a conjunction or use a semicolon." },
  ],
  "Subject-verb agreement": [
    { error: "The number of attacks have increased.", correction: "The number of attacks has increased.", explanation: "The subject is 'number' (singular), not 'attacks.' Compare: 'A number of attacks have…' (where 'a number of' ≈ 'many')." },
    { error: "Each of the modules need to be tested.", correction: "Each of the modules needs to be tested.", explanation: "'Each' is singular and takes a singular verb, regardless of the plural noun that follows." },
  ],
  "Word order": [
    { error: "We can from the data see that…", correction: "We can see from the data that…", explanation: "In English, the verb follows the modal directly. Adverbial phrases come after the verb, not between modal and verb." },
    { error: "Only when the condition is met can we proceed.", correction: "We can proceed only when the condition is met. (neutral) / Only when the condition is met can we proceed. (emphatic)", explanation: "Both forms are grammatical, but note that fronting 'only when' triggers inversion (can we). The neutral order is more common in academic writing." },
  ],
};

/* ═══════════════════════════════════════════
   PRACTICE SENTENCES FOR GRAMMAR MODULE
   ═══════════════════════════════════════════ */

const GRAMMAR_PRACTICE = [
  { sentence: "We propose new algorithm for detect the malware in network.", corrected: "We propose a new algorithm for detecting malware in the network.", categories: ["Article usage", "Preposition choice"] },
  { sentence: "The researches shows that system have many vulnerability.", corrected: "The research shows that the system has many vulnerabilities.", categories: ["Singular/plural agreement", "Article usage"] },
  { sentence: "We test the system yesterday and find it work well.", corrected: "We tested the system yesterday and found that it worked well.", categories: ["Tense consistency"] },
  { sentence: "This method is different with the traditional approach, it uses deep learning.", corrected: "This method is different from the traditional approach; it uses deep learning.", categories: ["Preposition choice", "Run-on sentences"] },
  { sentence: "According to our experiment, each of the results are satisfactory.", corrected: "Based on our experiment, each of the results is satisfactory.", categories: ["Preposition choice", "Subject-verb agreement"] },
  { sentence: "We can from the log files see that number of attack have increased.", corrected: "We can see from the log files that the number of attacks has increased.", categories: ["Word order", "Article usage", "Subject-verb agreement"] },
  { sentence: "In future, more researches need to be done about this topic.", corrected: "In the future, more research needs to be done on this topic.", categories: ["Article usage", "Singular/plural agreement", "Preposition choice"] },
  { sentence: "The system was compose by three module and tested under different condition.", corrected: "The system was composed of three modules and tested under different conditions.", categories: ["Preposition choice", "Singular/plural agreement"] },
];


/* ═══════════════════════════════════════════
   FLATTENED BANKS (for rotation indexing)
   ═══════════════════════════════════════════ */

const PHRASEBANK_FLAT = Object.entries(PHRASEBANK_DATA).flatMap(([cat, items]) =>
  items.map((item) => ({ ...item, category: cat }))
);

const COMPARE_FLAT = Object.entries(COMPARE_DATA).flatMap(([cat, items]) =>
  items.map((item) => ({ ...item, category: cat }))
);

const GRAMMAR_REF_FLAT = Object.entries(GRAMMAR_DATA).flatMap(([cat, items]) =>
  items.map((item) => ({ ...item, category: cat }))
);

/* ═══════════════════════════════════════════
   CLAUDE API HELPER
   ═══════════════════════════════════════════ */

const callClaude = async (systemPrompt, userMessage) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });
    const data = await response.json();
    return data.content?.[0]?.text || "";
  } catch (err) {
    console.error("API error:", err);
    return null;
  }
};

/* ═══════════════════════════════════════════
   DATABASE API HELPER
   ═══════════════════════════════════════════ */

const api = {
  async get(path) {
    try {
      const res = await fetch(path);
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  async post(path, body) {
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  async put(path, body) {
    try {
      const res = await fetch(path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
  async del(path) {
    try {
      const res = await fetch(path, { method: "DELETE" });
      return res.ok ? await res.json() : null;
    } catch { return null; }
  },
};

/* ═══════════════════════════════════════════
   BANK CURSOR — rotates through items
   ═══════════════════════════════════════════ */

async function getNextItems(bankName, bankArray, count) {
  const data = await api.get(`/api/cursor/${bankName}`);
  let pos = data?.cursor_pos ?? 0;
  const total = bankArray.length;
  if (pos >= total) pos = 0; // wrap around
  const indices = [];
  for (let i = 0; i < count; i++) {
    indices.push((pos + i) % total);
  }
  const newPos = (pos + count) % total;
  await api.put(`/api/cursor/${bankName}`, { cursor_pos: newPos });
  return { items: indices.map((idx) => ({ ...bankArray[idx], _bankIndex: idx })), indices };
}


/* ═══════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════ */

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-4 justify-center">
      <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
      <span className="text-parchment-400 text-sm font-sans">Thinking…</span>
    </div>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-ink-600 transition-colors" title="Copy to clipboard">
      {copied ? <Check className="w-3.5 h-3.5 text-sage-400" /> : <Copy className="w-3.5 h-3.5 text-parchment-400" />}
    </button>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? "fill-gold-400 text-gold-400" : "text-ink-600"}`} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK TYPES — define what each task looks like
   ═══════════════════════════════════════════ */

const TASK_TYPES = [
  {
    id: "vocab",
    label: "Vocabulary",
    icon: BookOpen,
    color: "text-sage-400",
    bg: "bg-sage-400/10",
    border: "border-sage-400/20",
    bank: "vocab",
    bankArray: () => VOCAB_DATA,
    count: 10,
    desc: "Review flashcards",
  },
  {
    id: "phrases",
    label: "Academic Phrases",
    icon: FileText,
    color: "text-gold-400",
    bg: "bg-gold-400/10",
    border: "border-gold-400/20",
    bank: "phrasebank",
    bankArray: () => PHRASEBANK_FLAT,
    count: 2,
    desc: "Learn academic phrases",
  },
  {
    id: "rewrite",
    label: "Sentence Rewriting",
    icon: PenTool,
    color: "text-parchment-200",
    bg: "bg-parchment-400/5",
    border: "border-parchment-400/15",
    bank: "rewrite",
    bankArray: () => REWRITE_DATA,
    count: 2,
    desc: "Rewrite in academic English",
  },
  {
    id: "compare",
    label: "Casual vs Academic",
    icon: ArrowLeftRight,
    color: "text-gold-300",
    bg: "bg-gold-300/8",
    border: "border-gold-300/15",
    bank: "compare",
    bankArray: () => COMPARE_FLAT,
    count: 2,
    desc: "Study register transformations",
  },
  {
    id: "grammar",
    label: "Grammar Practice",
    icon: AlertTriangle,
    color: "text-wine-400",
    bg: "bg-wine-400/8",
    border: "border-wine-400/15",
    bank: "grammar",
    bankArray: () => GRAMMAR_PRACTICE,
    count: 2,
    desc: "Fix L1 transfer errors",
  },
  {
    id: "grammar_ref",
    label: "Grammar Patterns",
    icon: BookOpen,
    color: "text-wine-400",
    bg: "bg-wine-400/8",
    border: "border-wine-400/15",
    bank: "grammar_ref",
    bankArray: () => GRAMMAR_REF_FLAT,
    count: 2,
    desc: "Study common error patterns",
  },
];

// Non-vocab task types for daily selection
const NON_VOCAB_TYPES = TASK_TYPES.filter((t) => t.id !== "vocab");

/* ═══════════════════════════════════════════
   DAILY TASK GENERATION
   ═══════════════════════════════════════════ */

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 0x100000000;
  };
}

function pickDailyTaskTypes(dateStr) {
  const rng = seededRandom(dateStr);

  // Vocab appears ~1 in 5 days
  const includeVocab = rng() < 0.2;

  // Shuffle non-vocab types
  const shuffled = [...NON_VOCAB_TYPES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  if (includeVocab) {
    // 1 vocab + 2 others
    return [TASK_TYPES.find((t) => t.id === "vocab"), shuffled[0], shuffled[1]];
  } else {
    // 3 non-vocab
    return [shuffled[0], shuffled[1], shuffled[2]];
  }
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

/* ═══════════════════════════════════════════
   TASK VIEW: VOCABULARY (10 cards)
   ═══════════════════════════════════════════ */

function VocabTaskView({ items, onDone }) {
  const [cards, setCards] = useState(items.map((v, i) => ({ ...v, id: i, status: "unseen" })));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedExample, setGeneratedExample] = useState("");

  const current = cards[currentIndex];
  const reviewed = cards.filter((c) => c.status !== "unseen").length;
  const isLast = currentIndex === cards.length - 1;

  const markCard = (status) => {
    setCards((prev) => prev.map((c, i) => i === currentIndex ? { ...c, status } : c));
    api.put(`/api/vocab/${encodeURIComponent(current.word)}`, { status });
    setFlipped(false);
    setGeneratedExample("");
    if (!isLast) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const generateExample = async () => {
    setLoading(true);
    const result = await callClaude(
      "You are an English vocabulary tutor. Generate a single example sentence using the given word in an academic/technical cybersecurity or computer science context. Return ONLY the sentence, nothing else.",
      `Word: "${current.word}" (${current.pos}) — meaning: ${current.def}`
    );
    setGeneratedExample(result || "Could not generate example.");
    setLoading(false);
  };

  const allReviewed = reviewed === cards.length;

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-parchment-500 text-xs font-sans">{reviewed} / {cards.length} reviewed</span>
        <div className="flex gap-1">
          {cards.map((c, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${
              c.status === "known" ? "bg-sage-400" :
              c.status === "learning" ? "bg-gold-400" :
              i === currentIndex ? "bg-parchment-300" : "bg-ink-600"
            }`} />
          ))}
        </div>
      </div>

      {/* Card */}
      {current && (
        <div className="card-flip mb-6">
          <div
            className={`card-flip-inner cursor-pointer ${flipped ? "flipped" : ""}`}
            onClick={() => setFlipped(!flipped)}
            style={{ minHeight: "240px" }}
          >
            <div className="card-front absolute inset-0 bg-ink-800 border border-ink-600 rounded-xl p-8 flex flex-col items-center justify-center">
              <span className="text-parchment-500 text-xs uppercase tracking-widest font-sans mb-4">{current.category}</span>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-parchment-50 mb-3 italic">{current.word}</h2>
              <span className="text-parchment-400 text-sm font-sans">{current.pos}</span>
              <span className="text-parchment-500 text-xs mt-6 font-sans flex items-center gap-1">
                <Eye className="w-3 h-3" /> Tap to reveal
              </span>
            </div>
            <div className="card-back absolute inset-0 bg-ink-800 border border-gold-400/20 rounded-xl p-8 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-2xl text-parchment-50 italic">{current.word}</h3>
                  <span className="text-gold-400 text-sm font-sans">{current.pos}</span>
                </div>
              </div>
              <p className="text-parchment-100 font-sans text-sm mb-3">{current.def}</p>
              <p className="text-parchment-300 font-sans text-sm italic border-l-2 border-gold-400/30 pl-3 mb-3">"{current.example}"</p>
              {current.family !== "—" && (
                <p className="text-parchment-500 font-sans text-xs"><span className="text-parchment-400">Family:</span> {current.family}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Generated example */}
      {flipped && (
        <div className="mb-4 animate-fade-in">
          {generatedExample && (
            <div className="bg-ink-700/50 border border-ink-600 rounded-lg p-3 mb-3">
              <p className="text-parchment-300 font-sans text-sm flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="italic">{generatedExample}</span>
              </p>
            </div>
          )}
          <button onClick={generateExample} disabled={loading}
            className="text-sm font-sans text-gold-400 hover:text-gold-300 flex items-center gap-1.5 mx-auto transition-colors disabled:opacity-50">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            New example sentence
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setFlipped(false); setGeneratedExample(""); }}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg bg-ink-700 border border-ink-600 text-parchment-400 hover:border-parchment-500/30 transition-all disabled:opacity-30">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => markCard("learning")}
          className="px-4 py-2 rounded-lg bg-gold-400/10 border border-gold-400/30 text-gold-400 hover:bg-gold-400/20 transition-all font-sans text-sm flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4" /> Still learning
        </button>
        <button onClick={() => markCard("known")}
          className="px-4 py-2 rounded-lg bg-sage-400/10 border border-sage-400/30 text-sage-400 hover:bg-sage-400/20 transition-all font-sans text-sm flex items-center gap-1.5">
          <Check className="w-4 h-4" /> Know it
        </button>
        {!isLast ? (
          <button onClick={() => { setCurrentIndex(currentIndex + 1); setFlipped(false); setGeneratedExample(""); }}
            className="p-2 rounded-lg bg-ink-700 border border-ink-600 text-parchment-400 hover:border-parchment-500/30 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onDone} disabled={!allReviewed}
            className="px-4 py-2 rounded-lg bg-sage-400/15 border border-sage-400/30 text-sage-400 hover:bg-sage-400/25 transition-all font-sans text-sm disabled:opacity-40">
            Finish
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK VIEW: PHRASES (2 items)
   ═══════════════════════════════════════════ */

function PhrasesTaskView({ items, onDone }) {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-4">
      <p className="text-parchment-500 text-xs font-sans uppercase tracking-widest mb-2">Learn these phrases</p>
      {items.map((item, i) => (
        <div key={i} className="bg-ink-800 border border-ink-600 rounded-xl p-5" style={{ animationDelay: `${i * 150}ms` }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-gold-400 text-[10px] font-sans uppercase tracking-widest">{item.category}</span>
            <CopyButton text={item.phrase} />
          </div>
          <p className="text-parchment-50 font-sans text-base font-medium mb-3">{item.phrase}</p>
          <p className="text-parchment-300 font-sans text-sm italic border-l-2 border-gold-400/30 pl-3">{item.example}</p>
        </div>
      ))}
      <button onClick={onDone}
        className="mt-6 w-full py-3 rounded-xl bg-sage-400/10 border border-sage-400/25 text-sage-400 hover:bg-sage-400/20 transition-all font-sans text-sm flex items-center justify-center gap-2">
        <Check className="w-4 h-4" /> Got it, done
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK VIEW: REWRITE (2 sentences)
   ═══════════════════════════════════════════ */

function RewriteTaskView({ items, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRewrite, setUserRewrite] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const exercise = items[currentIndex];

  const checkRewrite = async () => {
    setLoading(true);
    const result = await callClaude(
      `You are an academic English writing tutor for a cybersecurity researcher. Evaluate the user's rewrite of a casual sentence into academic English. Return ONLY a JSON object with these fields:
- "rating": number 1-5 (academic tone, precision, grammar)
- "improvements": string (what the user improved well)
- "suggestions": string (what could be better)
- "model_rewrite": string (your own ideal academic rewrite)
No markdown fences, no preamble. JSON only.`,
      `Original casual sentence: "${exercise.casual}"\n\nUser's academic rewrite: "${userRewrite}"`
    );
    try {
      const parsed = JSON.parse(result);
      setFeedback(parsed);
      api.post("/api/rewrites", {
        original_sentence: exercise.casual,
        user_rewrite: userRewrite,
        ai_rating: parsed.rating,
        ai_feedback: parsed.suggestions,
        model_rewrite: parsed.model_rewrite,
      });
    } catch {
      setFeedback({ rating: 3, improvements: "Could not parse response.", suggestions: "Please try again.", model_rewrite: "" });
    }
    setLoading(false);
  };

  const nextOrDone = () => {
    const newCompleted = completedCount + 1;
    setCompletedCount(newCompleted);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserRewrite("");
      setFeedback(null);
      setShowModel(false);
    } else {
      onDone();
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-parchment-500 text-xs font-sans uppercase tracking-widest">Sentence {currentIndex + 1} of {items.length}</span>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < completedCount ? "bg-sage-400" : i === currentIndex ? "bg-gold-400" : "bg-ink-600"}`} />
          ))}
        </div>
      </div>

      <div className="bg-ink-800 border border-ink-600 rounded-xl p-6 mb-4">
        <span className="text-parchment-500 text-xs uppercase tracking-widest font-sans">Rewrite in academic English</span>
        <p className="mt-3 text-parchment-100 font-serif text-lg italic">"{exercise.casual}"</p>
      </div>

      <textarea value={userRewrite} onChange={(e) => setUserRewrite(e.target.value)}
        placeholder="Type your academic version…"
        className="w-full bg-ink-800 border border-ink-600 rounded-xl p-4 text-parchment-100 font-sans text-sm resize-none h-28 placeholder:text-parchment-500 focus:border-gold-400/40 transition-colors mb-4" />

      <div className="flex items-center gap-3 mb-6">
        <button onClick={checkRewrite} disabled={loading || !userRewrite.trim()}
          className="px-4 py-2 rounded-lg bg-gold-400/15 border border-gold-400/30 text-gold-400 hover:bg-gold-400/25 transition-all font-sans text-sm disabled:opacity-40 flex items-center gap-1.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
          Check
        </button>
        <button onClick={() => setShowModel(!showModel)}
          className="px-4 py-2 rounded-lg bg-ink-700 border border-ink-600 text-parchment-400 hover:border-parchment-500/30 transition-all font-sans text-sm flex items-center gap-1.5">
          {showModel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showModel ? "Hide" : "Show"} answer
        </button>
      </div>

      {showModel && (
        <div className="bg-sage-400/5 border border-sage-400/20 rounded-xl p-4 mb-4 animate-fade-in">
          <span className="text-sage-400 text-xs uppercase tracking-widest font-sans">Model answer</span>
          <p className="mt-2 text-parchment-100 font-sans text-sm">{exercise.model}</p>
        </div>
      )}

      {feedback && (
        <div className="bg-ink-700/50 border border-gold-400/15 rounded-xl p-5 mb-4 animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gold-400 text-xs uppercase tracking-widest font-sans">Feedback</span>
            <StarRating rating={feedback.rating} />
          </div>
          <div>
            <p className="text-sage-400 text-xs font-sans uppercase tracking-wider mb-1">Strengths</p>
            <p className="text-parchment-200 font-sans text-sm">{feedback.improvements}</p>
          </div>
          <div>
            <p className="text-gold-400 text-xs font-sans uppercase tracking-wider mb-1">Suggestions</p>
            <p className="text-parchment-200 font-sans text-sm">{feedback.suggestions}</p>
          </div>
          {feedback.model_rewrite && (
            <div>
              <p className="text-parchment-500 text-xs font-sans uppercase tracking-wider mb-1">AI rewrite</p>
              <p className="text-parchment-100 font-sans text-sm italic border-l-2 border-gold-400/30 pl-3">{feedback.model_rewrite}</p>
            </div>
          )}
        </div>
      )}

      {(feedback || showModel) && (
        <button onClick={nextOrDone}
          className="w-full py-3 rounded-xl bg-sage-400/10 border border-sage-400/25 text-sage-400 hover:bg-sage-400/20 transition-all font-sans text-sm flex items-center justify-center gap-2">
          {currentIndex < items.length - 1 ? (
            <><ChevronRight className="w-4 h-4" /> Next sentence</>
          ) : (
            <><Check className="w-4 h-4" /> Done</>
          )}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK VIEW: COMPARE (2 pairs)
   ═══════════════════════════════════════════ */

function CompareTaskView({ items, onDone }) {
  const [quizAnswer, setQuizAnswer] = useState("");
  const [revealed, setRevealed] = useState(Array(items.length).fill(false));

  const revealItem = (i) => {
    setRevealed((prev) => prev.map((r, idx) => idx === i ? true : r));
  };

  const allRevealed = revealed.every(Boolean);

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-4">
      <p className="text-parchment-500 text-xs font-sans uppercase tracking-widest mb-2">What's the academic equivalent?</p>
      {items.map((pair, i) => (
        <div key={i} className={`border rounded-xl overflow-hidden transition-all ${revealed[i] ? "border-gold-400/20 bg-ink-800" : "border-ink-600 bg-ink-800"}`}>
          <div className="p-5">
            <span className="text-parchment-500 text-[10px] font-sans uppercase tracking-widest">{pair.category}</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div>
                <span className="text-wine-400 text-[10px] font-sans uppercase tracking-widest">Casual</span>
                <p className="text-parchment-200 font-sans text-base mt-1">"{pair.casual}"</p>
              </div>
              <div>
                <span className="text-sage-400 text-[10px] font-sans uppercase tracking-widest">Academic</span>
                {revealed[i] ? (
                  <div className="animate-fade-in">
                    <p className="text-parchment-50 font-sans text-base mt-1 font-medium">{pair.academic}</p>
                    <p className="text-parchment-500 font-sans text-xs mt-2">{pair.note}</p>
                  </div>
                ) : (
                  <button onClick={() => revealItem(i)}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-ink-700 border border-ink-600 text-parchment-400 hover:border-parchment-500/30 transition-all font-sans text-sm flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> Reveal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {allRevealed && (
        <button onClick={onDone}
          className="mt-4 w-full py-3 rounded-xl bg-sage-400/10 border border-sage-400/25 text-sage-400 hover:bg-sage-400/20 transition-all font-sans text-sm flex items-center justify-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" /> Got it, done
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK VIEW: GRAMMAR PRACTICE (2 sentences)
   ═══════════════════════════════════════════ */

function GrammarTaskView({ items, onDone }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const practice = items[currentIndex];

  const nextOrDone = () => {
    const newCompleted = completedCount + 1;
    setCompletedCount(newCompleted);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowAnswer(false);
    } else {
      onDone();
    }
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-parchment-500 text-xs font-sans uppercase tracking-widest">Sentence {currentIndex + 1} of {items.length}</span>
        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i < completedCount ? "bg-sage-400" : i === currentIndex ? "bg-wine-400" : "bg-ink-600"}`} />
          ))}
        </div>
      </div>

      <div className="bg-ink-800 border border-ink-600 rounded-xl p-6 mb-4">
        <span className="text-parchment-500 text-xs uppercase tracking-widest font-sans">Fix the errors</span>
        <p className="mt-3 text-parchment-100 font-serif text-lg italic">"{practice.sentence}"</p>
        <div className="flex gap-1.5 mt-3">
          {practice.categories.map((cat) => (
            <span key={cat} className="text-[10px] font-sans px-2 py-0.5 rounded bg-wine-400/10 text-wine-400">{cat}</span>
          ))}
        </div>
      </div>

      <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="Type the corrected sentence…"
        className="w-full bg-ink-800 border border-ink-600 rounded-xl p-4 text-parchment-100 font-sans text-sm resize-none h-20 placeholder:text-parchment-500 focus:border-gold-400/40 transition-colors mb-4" />

      {!showAnswer && (
        <button onClick={() => setShowAnswer(true)}
          className="px-4 py-2 rounded-lg bg-gold-400/15 border border-gold-400/30 text-gold-400 hover:bg-gold-400/25 transition-all font-sans text-sm mb-4">
          Check answer
        </button>
      )}

      {showAnswer && (
        <>
          <div className="bg-sage-400/5 border border-sage-400/20 rounded-xl p-4 mb-4 animate-fade-in">
            <span className="text-sage-400 text-xs uppercase tracking-widest font-sans">Correct version</span>
            <p className="text-parchment-100 font-sans text-sm mt-2">{practice.corrected}</p>
          </div>
          <button onClick={nextOrDone}
            className="w-full py-3 rounded-xl bg-sage-400/10 border border-sage-400/25 text-sage-400 hover:bg-sage-400/20 transition-all font-sans text-sm flex items-center justify-center gap-2">
            {currentIndex < items.length - 1 ? (
              <><ChevronRight className="w-4 h-4" /> Next sentence</>
            ) : (
              <><Check className="w-4 h-4" /> Done</>
            )}
          </button>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK VIEW: GRAMMAR REFERENCE (2 error patterns)
   ═══════════════════════════════════════════ */

function GrammarRefTaskView({ items, onDone }) {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-4">
      <p className="text-parchment-500 text-xs font-sans uppercase tracking-widest mb-2">Study these error patterns</p>
      {items.map((item, i) => (
        <div key={i} className="bg-ink-800 border border-ink-600 rounded-xl p-5">
          <span className="text-wine-400 text-[10px] font-sans uppercase tracking-widest">{item.category}</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 mb-3">
            <div>
              <span className="text-wine-400 text-[10px] font-sans uppercase tracking-widest">Error</span>
              <p className="text-parchment-300 font-sans text-sm mt-0.5 line-through decoration-wine-400/50">{item.error}</p>
            </div>
            <div>
              <span className="text-sage-400 text-[10px] font-sans uppercase tracking-widest">Correct</span>
              <p className="text-parchment-100 font-sans text-sm mt-0.5">{item.correction}</p>
            </div>
          </div>
          <p className="text-parchment-400 font-sans text-xs border-t border-ink-600 pt-3">{item.explanation}</p>
        </div>
      ))}
      <button onClick={onDone}
        className="mt-4 w-full py-3 rounded-xl bg-sage-400/10 border border-sage-400/25 text-sage-400 hover:bg-sage-400/20 transition-all font-sans text-sm flex items-center justify-center gap-2">
        <Check className="w-4 h-4" /> Got it, done
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TASK RENDERER — picks the right view
   ═══════════════════════════════════════════ */

function TaskView({ task, onDone }) {
  switch (task.typeId) {
    case "vocab": return <VocabTaskView items={task.items} onDone={onDone} />;
    case "phrases": return <PhrasesTaskView items={task.items} onDone={onDone} />;
    case "rewrite": return <RewriteTaskView items={task.items} onDone={onDone} />;
    case "compare": return <CompareTaskView items={task.items} onDone={onDone} />;
    case "grammar": return <GrammarTaskView items={task.items} onDone={onDone} />;
    case "grammar_ref": return <GrammarRefTaskView items={task.items} onDone={onDone} />;
    default: return <p className="text-parchment-400">Unknown task type.</p>;
  }
}

/* ═══════════════════════════════════════════
   HOME SCREEN
   ═══════════════════════════════════════════ */

function HomeScreen({ tasks, onOpenTask, onToggleComplete }) {
  const completedCount = tasks.filter((t) => t.completed).length;
  const allDone = completedCount === 3;

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-parchment-500 text-xs font-sans uppercase tracking-[0.25em]">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-parchment-50 mt-2">
          {allDone ? "All done for today" : "Today's practice"}
        </h2>
        {allDone && (
          <p className="text-sage-400 font-sans text-sm mt-2 animate-fade-in">
            Great work. Come back tomorrow for fresh tasks.
          </p>
        )}
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {tasks.map((t, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${t.completed ? "bg-sage-400 scale-110" : "bg-ink-600"}`} />
        ))}
      </div>

      <div className="space-y-3">
        {tasks.map((task, i) => {
          const taskType = TASK_TYPES.find((t) => t.id === task.typeId);
          if (!taskType) return null;
          const Icon = taskType.icon;
          return (
            <div key={i}
              className={`group border rounded-xl transition-all duration-300 ${
                task.completed
                  ? "bg-ink-800/50 border-ink-700 opacity-60"
                  : `${taskType.bg} ${taskType.border} hover:border-opacity-50`
              }`}>
              <div className="flex items-center gap-4 p-4 md:p-5">
                <button onClick={(e) => { e.stopPropagation(); onToggleComplete(i); }}
                  className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    task.completed ? "border-sage-400 bg-sage-400/20" : "border-parchment-500/30 hover:border-parchment-400/50"
                  }`}>
                  {task.completed && <Check className="w-3.5 h-3.5 text-sage-400" />}
                </button>

                <button onClick={() => !task.completed && onOpenTask(i)} className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`w-4 h-4 ${taskType.color}`} />
                    <span className={`text-[10px] font-sans uppercase tracking-widest ${taskType.color}`}>{taskType.label}</span>
                  </div>
                  <p className={`font-sans text-sm font-medium ${task.completed ? "text-parchment-500 line-through" : "text-parchment-100"}`}>
                    {taskType.desc} ({taskType.count} {taskType.count === 1 ? "item" : "items"})
                  </p>
                </button>

                {!task.completed && <ChevronRight className="w-4 h-4 text-parchment-500 group-hover:text-parchment-300 transition-colors shrink-0" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════ */

export default function App() {
  const [view, setView] = useState("home"); // "home" | "task"
  const [tasks, setTasks] = useState([]);
  const [activeTaskIndex, setActiveTaskIndex] = useState(null);
  const [ready, setReady] = useState(false);
  const today = useRef(getToday());

  // Generate and load daily tasks
  useEffect(() => {
    const dateStr = today.current;

    async function init() {
      // Check if today's tasks already saved
      const saved = await api.get(`/api/daily-tasks/${dateStr}`);

      if (saved && saved.length === 3) {
        // Restore from DB — items were already drawn from the bank
        const restoredTasks = saved.map((s) => {
          const taskType = TASK_TYPES.find((t) => t.id === s.task_type);
          const itemIndices = JSON.parse(s.item_ids);
          const bankArray = taskType.bankArray();
          const items = itemIndices.map((idx) => bankArray[idx]).filter(Boolean);
          return {
            typeId: s.task_type,
            items,
            itemIndices,
            completed: !!s.completed,
            task_index: s.task_index,
          };
        });
        setTasks(restoredTasks);
      } else {
        // First visit today — pick task types and draw items from banks
        const taskTypes = pickDailyTaskTypes(dateStr);
        const newTasks = [];

        for (let i = 0; i < taskTypes.length; i++) {
          const tt = taskTypes[i];
          const { items, indices } = await getNextItems(tt.bank, tt.bankArray(), tt.count);
          newTasks.push({
            typeId: tt.id,
            items,
            itemIndices: indices,
            completed: false,
            task_index: i,
          });
        }

        // Save to DB
        await api.post("/api/daily-tasks", {
          date: dateStr,
          tasks: newTasks.map((t) => ({
            task_index: t.task_index,
            task_type: t.typeId,
            item_ids: JSON.stringify(t.itemIndices),
          })),
        });

        setTasks(newTasks);
      }

      setReady(true);
    }

    init();
  }, []);

  const openTask = (index) => {
    setActiveTaskIndex(index);
    setView("task");
  };

  const goHome = () => {
    setView("home");
    setActiveTaskIndex(null);
  };

  const completeCurrentTask = () => {
    if (activeTaskIndex != null) {
      setTasks((prev) => prev.map((t, i) => i === activeTaskIndex ? { ...t, completed: true } : t));
      api.put(`/api/daily-tasks/${today.current}/${activeTaskIndex}/complete`);
    }
    goHome();
  };

  const toggleComplete = (index) => {
    setTasks((prev) => {
      const updated = prev.map((t, i) => i === index ? { ...t, completed: !t.completed } : t);
      if (updated[index].completed) {
        api.put(`/api/daily-tasks/${today.current}/${index}/complete`);
      } else {
        api.put(`/api/daily-tasks/${today.current}/${index}/uncomplete`);
      }
      return updated;
    });
  };

  const activeTask = activeTaskIndex != null ? tasks[activeTaskIndex] : null;
  const activeType = activeTask ? TASK_TYPES.find((t) => t.id === activeTask.typeId) : null;

  if (!ready) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-ink-700 bg-ink-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== "home" ? (
              <button onClick={goHome} className="p-1.5 -ml-1.5 rounded-lg hover:bg-ink-700 transition-colors">
                <ChevronLeft className="w-5 h-5 text-parchment-400" />
              </button>
            ) : (
              <BookMarked className="w-6 h-6 text-gold-400" />
            )}
            <div>
              {view === "home" ? (
                <>
                  <h1 className="font-serif text-xl text-parchment-50 tracking-tight leading-none">The Scriptorium</h1>
                  <p className="text-parchment-500 text-[10px] font-sans uppercase tracking-[0.2em] mt-0.5">English Mastery Suite</p>
                </>
              ) : (
                <>
                  <h1 className="font-serif text-lg text-parchment-50 tracking-tight leading-none">{activeType?.label}</h1>
                  <p className="text-parchment-500 text-[10px] font-sans mt-0.5">{activeType?.desc}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === "home" && (
          <HomeScreen tasks={tasks} onOpenTask={openTask} onToggleComplete={toggleComplete} />
        )}
        {view === "task" && activeTask && (
          <TaskView task={activeTask} onDone={completeCurrentTask} />
        )}
      </main>

      <footer className="border-t border-ink-700 py-6 mt-12">
        <p className="text-center text-parchment-500 text-xs font-sans">
          Built for the journey from fluency to mastery · Powered by Claude
        </p>
      </footer>
    </div>
  );
}
